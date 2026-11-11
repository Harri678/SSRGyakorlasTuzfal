import { Injectable } from '@nestjs/common';
import mysql, { ResultSetHeader } from 'mysql2/promise'
import { Szabaly } from './szabaly.js';
import 'dotenv/config';
import { szabalyDto } from './szbalyDto.dto.js';

const mysqlConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async szabalyokListazasa(){
    const[result] = await mysqlConnection.execute(
      "SELECT * FROM blocklist"
    )
    const rows = result as Szabaly[]
    return rows
  }

  async szabalyHozzaadasa(szabaly: szabalyDto){
    const [rows] = await mysqlConnection.execute(
        'SELECT MAX(id) + 1 AS newId FROM blocklist'
    );

    const newId = (rows as any[])[0].newId ?? 1;

    const[result] = await mysqlConnection.execute<ResultSetHeader>(
      'INSERT INTO blocklist (id, priority, mac, enabled) VALUES(?, ?, ?, ?)',
      [newId,szabaly.priority, szabaly.mac, szabaly.enabled === "on" ? 1: 0]
    )
  }
}
