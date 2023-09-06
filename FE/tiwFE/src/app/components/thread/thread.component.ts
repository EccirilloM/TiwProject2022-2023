import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from 'src/app/services/thread.service';
import { UserService } from 'src/app/services/user.service';
import { LikeService } from 'src/app/services/like.service';
import { switchMap } from 'rxjs';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
  thread: any; // Considera di utilizzare un tipo più specifico al posto di 'any'
  messages: any[] = [];
  comments: { [key: number]: any[] } = {};
  newMessageText: string = "";
  previewImage: string | null = null;  // Per l'anteprima
  selectedFile: File | null = null;  // Per l'invio
  showCommentInput: { [key: number]: boolean } = {};
  newCommentText: string = "";



  userImages: { [key: string]: string } = {}; // Oggetto per memorizzare le immagini del profilo

  constructor(private threadService: ThreadService, private userService: UserService, private likeService: LikeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const threadId = params.get('id');
        if (threadId === null) {
          return EMPTY;
        }
        return this.threadService.getThreadInfo(+threadId);
      })
    ).subscribe({
      next: thread => this.loadThreadData(thread.id),  // Ora chiamiamo loadThreadData passandogli l'ID del thread
      error: err => console.error('Si è verificato un errore!', err),
    });
  }   
  
  loadThreadData(threadId: number): void {
    // Non c'è bisogno di leggere l'ID del thread dall'URL; lo prendiamo come argomento
  
    // Chiamata per ottenere le informazioni sul thread
    this.threadService.getThreadInfo(threadId).subscribe({
      next: (data) => {
        this.thread = data;
        
        // Chiamata per ottenere l'immagine dell'utente
        this.userService.getUserWithImage(this.thread.user.username).subscribe({
          next: (userData) => {
            this.thread.user.profileImage = userData.profileImage;
          },
          error: (err) => {
            console.error('Errore nel recuperare l\'immagine dell\'utente:', err);
          }
        });
        
        // Chiamata per ottenere lo stato del like/dislike
        this.likeService.checkLikeStatus(threadId.toString(), "thread").subscribe({
          next: likeStatus => {
            this.thread.likeStatus = likeStatus.likeStatus;
            console.log(likeStatus.likeStatus);
          },
          error: err => {
            console.error('Errore nel recuperare lo stato del like:', err);
          }
        });
  
        // Chiamata per ottenere i messaggi del thread
        this.loadMessages(threadId);
      },
      error: (err) => {
        console.error('Errore nel recuperare il thread:', err);
      }
    });
  }
  
  loadMessages(threadId: number): void {
    // Chiamata per ottenere i messaggi del thread
    this.threadService.getThreadMessages(threadId).subscribe({
      next: (messagesData) => {
        this.messages = messagesData;
        
        // Ordina i messaggi in ordine decrescente di data di creazione
        this.messages.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();  // Ordine decrescente
        });
  
        // Per ogni messaggio, carica l'immagine del profilo e del messaggio
        this.messages.forEach(message => {
          this.userService.getUserWithImage(message.user.username).subscribe(user => {
            this.userImages[message.user.username] = user.profileImage;
          });
          if (message.image) {
            message.image = `${this.userService.backEndUrl}/messageImages/${message.image}?${Date.now()}`;
          }

          // Aggiungi questa parte per verificare lo stato del like per ogni messaggio
          this.likeService.checkLikeStatus(message.id.toString(), 'message').subscribe({
            next: likeStatus => {
              message.likeStatus = likeStatus.likeStatus;
            },
            error: error => {
              console.error('Errore nel recuperare lo stato del like:', error);
            }
          });
  
          this.loadComments(message.id);
        });
      },
      error: (err) => {
        console.error('Errore nel recuperare i messaggi del thread:', err);
      }
    });
  }

  loadComments(messageId: number): void {
    console.log(`Loading comments for message ${messageId}`);
    // Chiamata per ottenere i commenti del messaggio
    this.threadService.getMessageComments(messageId).subscribe({
      next: (commentsData) => {
        this.comments[messageId] = commentsData;
  
        // Ordina i commenti in ordine decrescente di data di creazione
        this.comments[messageId].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        
        // Carica l'immagine del profilo per ogni commento
        this.comments[messageId].forEach(comment => {
          console.log(comment);
          this.userService.getUserWithImage(comment.user.username).subscribe(user => {
              this.userImages[comment.user.username] = user.profileImage; 
          });
          // Aggiungi questa parte per verificare lo stato del like per ogni commento
          this.likeService.checkLikeStatus(comment.id.toString(), 'comment').subscribe({
            next: likeStatus => {
              comment.likeStatus = likeStatus.likeStatus;
            },
            error: error => {
              console.error('Errore nel recuperare lo stato del like:', error);
            }
          });
        });
      },
      error: (err) => {
        console.error(`Errore nel recuperare i commenti del messaggio ${messageId}:`, err);
      }
    });
  }
  
 // In thread.ts

  handleLikeThread(threadId: string): void {
    this.likeService.handleLikeComponents(threadId, 'thread', [this.thread]);
    console.log("Tentativo di mettere 'Mi piace' al thread con ID:", threadId);
    this.loadThreadData(Number(this.thread.id));
  }

  handleDislikeThread(threadId: string): void {
    this.likeService.handleDislikeComponents(threadId, 'thread', [this.thread]);
    console.log("Tentativo di mettere 'Non mi piace' al thread con ID:", threadId);
    this.loadThreadData(Number(this.thread.id));
  }

  handleLikeMessage(messageId: string): void {
    this.likeService.handleLikeComponents(messageId, 'message', this.messages);
    console.log("Tentativo di mettere 'Mi piace' al messaggio con ID:", messageId);
    this.loadMessages(Number(this.thread.id));
  }

  handleDislikeMessage(messageId: string): void {
    this.likeService.handleDislikeComponents(messageId, 'message', this.messages);
    console.log("Tentativo di mettere 'Non mi piace' al messaggio con ID:", messageId);
    this.loadMessages(Number(this.thread.id));
  }

  handleLikeComment(commentId: string, messageId: number): void {
    this.likeService.handleLikeComponents(commentId, 'comment', this.comments[messageId] || []);
    console.log("Tentativo di mettere 'Mi piace' al commento con ID:", commentId);
    this.loadComments(messageId);
  }

  handleDislikeComment(commentId: string, messageId: number): void {
    this.likeService.handleDislikeComponents(commentId, 'comment', this.comments[messageId] || []);
    console.log("Tentativo di mettere 'Non mi piace' al commento con ID:", commentId);
    this.loadComments(messageId);
  }

  createMessage() {
    console.log("Invio messaggio:", this.newMessageText); // Debug
  
    // Prima crea il messaggio
    this.userService.createMessage(this.newMessageText, this.thread.id).subscribe({
      next: (newMessage) => {
        this.messages.push(newMessage);
        this.newMessageText = '';  // Svuota il campo di testo
  
        // Ora che abbiamo l'ID del nuovo messaggio, carichiamo l'immagine
        if (this.selectedFile) {  // Modificato da this.previewImage a this.selectedFile
          this.userService.uploadMessageImage(newMessage.id, this.selectedFile).subscribe({
            next: (response) => {
              // Aggiorna l'elenco dei messaggi, se necessario
              newMessage.image = `${this.userService.backEndUrl}/messageImages/${newMessage.id}.jpeg?${Date.now()}`;
              this.previewImage = null;  // Pulisce l'anteprima dell'immagine
            },
            error: (err) => {
              console.error("Errore durante l'upload dell'immagine", err);
            }
          });
        }
      },
      error: (err) => {
        console.error("Impossibile inviare il messaggio", err);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        this.previewImage = reader.result as string;
      };
  
      reader.readAsDataURL(this.selectedFile);  
    }
  }

  removeImage() {
    this.previewImage = null;
    this.selectedFile = null;  // Aggiunto
  }
  
  createComment(messageId: number, commentText: string): void {
    // Dati per creare il nuovo commento
    const newCommentData = {
      text: commentText,
      // altri dati necessari, come ad esempio l'ID del thread o l'ID dell'utente
    };
  
    // Chiamata al servizio per creare il nuovo commento
    this.userService.createComment(commentText, messageId).subscribe({
      next: (newComment) => {
        // Aggiunge il nuovo commento all'array dei commenti per quel particolare messaggio
        if (this.comments[messageId]) {
          this.comments[messageId].push(newComment);
        } else {
          this.comments[messageId] = [newComment];
        }
  
        // Eventualmente, potete anche ordinare i commenti qui
      },
      error: (err) => {
        console.error('Errore nella creazione del commento:', err);
      }
    });
  } 

  toggleCommentInput(messageId: number): void {
    this.showCommentInput[messageId] = !this.showCommentInput[messageId];
  }
}




