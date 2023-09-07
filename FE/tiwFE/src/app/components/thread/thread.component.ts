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
    console.log('Loading thread data for thread ID:', threadId);
    // Chiamata per ottenere le informazioni sul thread
    this.threadService.getThreadInfo(threadId).subscribe({
      next: (data) => {
        this.thread = data;
        
        // Chiamata per ottenere l'immagine dell'utente
        this.userService.getUserBasicInfo(this.thread.user.username).subscribe({
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
    console.log('Inizio caricamento messaggi per thread ID:', threadId);
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
          this.userService.getUserBasicInfo(message.user.username).subscribe(user => {
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
    console.log('Inizio caricamento commenti per messaggio ID:', messageId);
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
          this.userService.getUserBasicInfo(comment.user.username).subscribe(user => {
            if (user) {
              this.userImages[comment.user.username] = user.profileImage; 
            } else {
              console.log("Utente non trovato per il commento", comment);
            }
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

    createMessage() {
      if (!this.newMessageText.trim()) {
        console.error('Il testo del messaggio non può essere vuoto.');
        return;
      }

      this.userService.createMessage(this.newMessageText.trim(), this.thread.id).subscribe({
        next: newMessage => {
          this.newMessageText = ''; 
          if (this.selectedFile) {
            this.userService.uploadMessageImage(newMessage.id, this.selectedFile).subscribe({
              next: response => {
                this.previewImage = null; 
                this.loadMessages(this.thread.id);  // Riaggiorna la lista dei messaggi
              },
              error: err => {
                console.error("Errore durante l'upload dell'immagine:", err);
                this.loadMessages(this.thread.id);  // Riaggiorna la lista dei messaggi anche in caso di errore
              }
            });
          } else {
            this.loadMessages(this.thread.id);  // Riaggiorna la lista dei messaggi
          }
        },
        error: err => {
          console.error("Impossibile inviare il messaggio:", err);
        }
      });
  }

  createComment(messageId: number, commentText: string): void {
      if (!commentText.trim()) {
        console.error('Il testo del commento non può essere vuoto.');
        return;
      }

      this.userService.createComment(commentText.trim(), messageId).subscribe({
        next: newComment => {
          this.loadComments(messageId);  // Riaggiorna la lista dei commenti per il messaggio specifico
        },
        error: err => {
          console.error('Errore nella creazione del commento:', err);
        }
      });
  }


  
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
    this.loadMessages(Number(this.thread.id));
  }

  handleDislikeMessage(messageId: string): void {
    this.likeService.handleDislikeComponents(messageId, 'message', this.messages);
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
  
  toggleCommentInput(messageId: number): void {
    this.showCommentInput[messageId] = !this.showCommentInput[messageId];
  }
}
