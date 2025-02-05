import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor (@InjectRepository(Todo) private readonly todoRepository: Repository<Todo>) {}
  async create(payload: CreateTodoDto, user:User) {
    const todo = new Todo();
    todo.userId = user.id;
    todo.tittle = payload.tittle,
    todo.description = payload.description
    Object.assign(todo, payload);
    this.todoRepository.create(todo);
    return await this.todoRepository.save(todo);
  }

  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}

