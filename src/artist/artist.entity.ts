import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['stageName'])
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageName: string;

  @Column({ nullable: true })
  biography: string;

  @OneToOne(() => User, (user) => user.artist, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];
}
