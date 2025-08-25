import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateSubmissionInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  userEditedSummary?: string;

  @Field({ nullable: true })
  userEditedKeyPoints?: string;
}