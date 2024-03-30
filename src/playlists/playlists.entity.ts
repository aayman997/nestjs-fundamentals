/*
 @Entity('playlists')
 export class Playlist {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 name: string;

 @OneToMany(() => Song, (song) => song.playlists)
 songs: Song[];

 @ManyToOne(() => User, (users) => users.playlists)
 users: User;
 }
 */
