import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  originalFilename: string;

  @Column('text')
  @Field()
  geminiSummary: string;

  @Column('text')
  @Field()
  geminiKeyPoints: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  userEditedSummary?: string;

  @Column('text', { nullable: true })
  @Field({ nullable: true })
  userEditedKeyPoints?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}