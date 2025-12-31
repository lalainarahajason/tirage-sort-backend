import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from '../../shared/utils/logger';

export class SocketService {
    private static instance: SocketService;
    private io: Server | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(httpServer: HttpServer): void {
        this.io = new Server(httpServer, {
            cors: {
                origin: '*', // Allow all origins for now (adjust for production)
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', (socket: Socket) => {
            logger.info(`🔌 Socket connected: ${socket.id}`);

            socket.on('disconnect', () => {
                logger.info(`🔌 Socket disconnected: ${socket.id}`);
            });
        });

        logger.info('✅ Socket.io initialized');
    }

    public emit(event: string, data: any): void {
        if (this.io) {
            this.io.emit(event, data);
        } else {
            logger.warn('⚠️ Socket.io is not initialized, cannot emit event:', event);
        }
    }

    public emitDrawStarted(drawId: string): void {
        this.emit('draw_started', { drawId });
    }

    public emitWinnerSelected(drawId: string, winner: any): void {
        this.emit('winner_selected', { drawId, winner });
    }

    public emitParticipantAdded(drawId: string, participant: any): void {
        this.emit('participant_added', { drawId, participant });
    }
}
