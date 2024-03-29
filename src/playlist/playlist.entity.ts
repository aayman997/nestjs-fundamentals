/*
 @Entity('playlist')
 export class Playlist {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 name: string;

 @OneToMany(() => Song, (song) => song.playlist)
 songs: Song[];

 @ManyToOne(() => User, (user) => user.playlists)
 user: User;
 }
 */
