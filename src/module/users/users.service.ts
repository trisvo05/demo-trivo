import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
// import { encryptData, decryptData } from 'src/common/crypto';
// import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  // async create(createUserDto: CreateUserDto) {
  //   const newUser = new this.userModel({
  //     name: encryptData(createUserDto.name),
  //     email: encryptData(createUserDto.email),
  //     password: encryptData(createUserDto.password),
  //   });

  //   return newUser.save();
  // }

  // async findAll() {
  //   const users = await this.userModel.find().lean();
  //   return users.map((user) => ({
  //     ...user,
  //     name: decryptData(user.name),
  //     email: decryptData(user.email),
  //     password: decryptData(user.password),
  //   }));
  // }

  // Phía trên là cách thường làm , mỗi field cần mã hóa hay giải mã thì đều phải gọi hàm
  // Ý tưởng là sử dụng mongoose middleware để tự động mã hóa trước khi lưu và giải mã sau khi truy vấn mà không cần phải gọi hàm thủ công trong service -> code sẽ sạch hơn vì không cần phải sửa gì ạ
  // Trước : mã hóa trước -> vào mongoose -> vào db
  // Sau : post dữ liệu vào mongoose -> mongoose mã hóa -> lưu vào db
  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);

    return newUser.save();
  }

  async findAll() {
    const users = await this.userModel.find().lean();
    return users.map((user) => ({ ...user }));
  }

  async findByEmail(email: string) {
    const users = await this.userModel.find().lean();
    return users.find((user) => user.email === email) ?? null;
  }
}
