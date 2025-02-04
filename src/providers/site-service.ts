import { Site, SiteCreateDto } from "@/models/site";
import { DbService } from "./database-service";

export class SiteService {
  constructor(private readonly dbService: DbService) {}

  async createTableIfNotExist() {
    await this.dbService.connect();
    const res = await this.dbService.db
      ?.execute(`CREATE TABLE IF NOT EXISTS sites(
        id INTEGER PRIMARY KEY NOT NULL,
        header TEXT NOT NULL,
        content TEXT NOT NULL,
        file_path TEXT,
        location TEXT,
        date TEXT
      )`);
    if (res) console.log("table is created " + res);
    await this.dbService.close();
  }

  async getAllSites(): Promise<Site[] | undefined> {
    await this.dbService.connect();
    const res = await this.dbService.db?.query(`SELECT * FROM sites`);
    const data: Site[] | undefined = res?.values?.map((val) => {
      const site: Site = {
        id: val.id,
        header: val.header,
        content: val.content,
        filePath: val.file_path,
        location: val.location,
        date: val.date,
      };
      return site;
    });
    console.log(res);
    await this.dbService.close();
    return data;
  }

  async addSite(site: SiteCreateDto) {
    await this.dbService.connect();
    const { header, content } = site;
    const filePath = site.filePath ?? null;
    const date = site.date ?? null;
    const location = site.location ?? null;
    await this.dbService.db?.query(
      `INSERT INTO sites(id, header, content, file_path, location, date) VALUES (NULL, ?, ?, ?, ?, ?)`,
      [header, content, filePath, location, date]
    );
    await this.dbService.close();
  }

  async getSiteById(id: number) {
    await this.dbService.connect();
    const res = await this.dbService.db?.query(
      `SELECT * FROM sites WHERE id = ?;`,
      [id]
    );
    let site: Site | undefined;
    if (res?.values) {
      const siteValue = res?.values[0];
      site = {
        content: siteValue.content,
        header: siteValue.header,
        date: siteValue.date,
        location: siteValue.location,
        id: siteValue.id,
        filePath: siteValue.file_path,
      };
    }
    await this.dbService.close();
    return site;
  }

  async updateSiteById(site: Site) {
    const { content, header, filePath, date, location, id } = site;
    await this.dbService.connect();
    await this.dbService.db?.query(
      `UPDATE sites SET content=?, header=?, file_path=?, date=?, location=? WHERE id=?`,
      [content, header, filePath ?? null, date ?? null, location ?? null, id]
    );
    await this.dbService.close();
  }

  async checkFileUsage(filePath: string): Promise<boolean> {
    await this.dbService.connect();
    const res = await this.dbService.db?.query(
      `SELECT * FROM sites WHERE file_path= ?`,
      [filePath]
    );
    await this.dbService.close();
    if (res?.values?.length) return res.values.length > 1;
    return false;
  }

  async deleteSiteById(id: number) {
    await this.dbService.connect();
    await this.dbService.db?.query(`DELETE FROM sites WHERE id=?`, [id]);
    await this.dbService.close();
  }
}
