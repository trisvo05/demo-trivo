import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { decryptData, encryptData } from 'src/common/crypto';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.name = encryptData(this.name);
  }

  if (this.isModified('email')) {
    this.email = encryptData(this.email);
  }

  if (this.isModified('password')) {
    this.password = encryptData(this.password);
  }
});

UserSchema.post('find', function (docs) {
  docs.forEach((doc) => {
    if (doc.name) {
      doc.name = decryptData(doc.name);
    }

    if (doc.email) {
      doc.email = decryptData(doc.email);
    }

    if (doc.password) {
      doc.password = decryptData(doc.password);
    }
  });
});
