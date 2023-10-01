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
@Unique(['email'])
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageName: string;

  @Column({ nullable: true })
  biography: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  //   @Column({ comment: 's3 업로드된 localtion url' })
  //   avatarUrl: string;
}
