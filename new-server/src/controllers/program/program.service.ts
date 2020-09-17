import { Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import Event from 'models/event.entity';

@Injectable()
class ProgramService {
  constructor(@InjectModel(Event.name) private EventModel: Model<Event>) {}

  find(props: {
    dateFrom?: Date;
    dateTill?: Date;
    limit?: number;
  }): Promise<Event[]> {
    const query = this.EventModel.find(
      { status: { $in: ['public', 'cancelled'] } },
      null,
    );

    query.select(
      '_id name status dateFrom dateTill groups leadersEvent description type subtype meeting registration',
    );
    query.populate('leaders', '_id name nickname group contacts.mobile');

    const today = new Date();
    today.setDate(today.getDate() - 3);

    query.where({
      dateTill: {
        $gte: props.dateFrom ? new Date(props.dateFrom) : today,
      },
    });
    if (props.dateTill)
      query.where({ dateFrom: { $lte: new Date(props.dateTill) } });

    query.sort('dateFrom order');
    query.limit(props.limit ? Math.min(100, Number(props.limit)) : 100);

    return query.exec();
  }
}

export default ProgramService;
