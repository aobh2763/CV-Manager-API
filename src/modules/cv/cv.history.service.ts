// cv.history.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CvHistory } from './cv.history';
import { Cv } from './cv.entity';
import { User } from '../user/user.entity';
import { Skill } from '../skill/skill.entity';

@Injectable()
export class CvHistoryService {
  constructor(
    @InjectRepository(CvHistory)
    private historyRepository: Repository<CvHistory>,
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  findAll(): Promise<CvHistory[]> {
    return this.historyRepository.find({ order: { createdAt: 'DESC' } });
  }

  findByCvId(cvId: number): Promise<CvHistory[]> {
    return this.historyRepository.find({
      where: { cvId },
      order: { createdAt: 'DESC' },
    });
  }

  async revertOneStep(cvId: number): Promise<Cv | { message: string }> {
    const [latest, previous] = await this.historyRepository.find({
      where: { cvId },
      order: { createdAt: 'DESC' },
      take: 2,
    });

    if (!latest) throw new NotFoundException(`No history found for CV ${cvId}`);

    // Handle CREATE — the CV was just created, only option is to delete it
    if (latest.action === 'CREATE') {
      throw new BadRequestException(
        `The last action was CREATE. The only way to revert is to delete CV #${cvId}. Use DELETE /cv/${cvId} instead.`,
      );
    }

    // Handle DELETE — the CV was just deleted, snapshot is gone from the DB
    if (latest.action === 'DELETE') {
      throw new BadRequestException(
        `The last action was DELETE. The CV no longer exists. The only way to revert is to create a new CV manually using the snapshot: ${JSON.stringify(latest.snapshot)}`,
      );
    }

    // Handle UPDATE — normal revert flow
    if (!previous) {
      throw new NotFoundException(
        `No previous state to revert to for CV ${cvId}`,
      );
    }

    const snap = previous.snapshot;

    const skills = snap.skills?.length
      ? await this.skillRepository.findBy({
          id: In(snap.skills.map((s: any) => s.id)),
        })
      : [];

    const cv =
      (await this.cvRepository.findOne({ where: { id: snap.id } })) ??
      this.cvRepository.create();

    Object.assign(cv, {
      id: snap.id,
      name: snap.name,
      firstName: snap.firstName,
      age: snap.age,
      CIN: snap.CIN,
      job: snap.job,
      path: snap.path,
      skills,
    });

    await this.historyRepository.remove(latest);

    return this.cvRepository.save(cv);
  }
}
