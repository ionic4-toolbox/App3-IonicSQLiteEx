import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';


@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) {

  }

  /**
   * Cria um banco caso não exista ou pega um banco existente com o nome no parametro
   */
  publi
  public getDB() {
    return this.sqlite.create({
      name: 'products.db',
      location: 'default'
    });
  }

 /**
   * Cria a estrutura inicial do banco de dados
   */
  public createDataBase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        this.createTables(db);
        this.insertDefaultItems(db);
      })
      .catch((e)  => console.error(e));
  }

  /**
   * Criando as tabelas no banco de dados
   * @param db
   */
  private createTables(db: SQLiteObject) {
    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS categories (id integer primary key AUTOINCREMENT NOT NULL, name TEXT)'],
      ['CREATE TABLE IF NOT EXISTS products (id integer primary key AUTOINCREMENT NOT NULL, name TEXT, price REAL, duedate DATE, active integer, category_id integer, FOREIGN KEY(category_id) REFERENCES categories(id))']
    ])
      .then(() => console.log('tabelas criadas'))
      .catch((e)  => console.error('Erro ao criar as tabelas ', e));
  }
/**
   * Incluindo os dados padrões
   * @param db
   */
  private insertDefaultItems(db: SQLiteObject) {
    db.executeSql('SELECT COUNT(id) as qtd from categories', {})
      .then((data: any) => {
        //se nao existir registros, cria
        if (data.rows.item(0).qtd == 0) {
            db.sqlBatch([
              ['INSERT INTO categories (name) VALUES (?)', ['Hamburgueres']],
              ['INSERT INTO categories (name) VALUES (?)', ['Bebidas']],
              ['INSERT INTO categories (name) VALUES (?)', ['Sobremesas']]
            ])
            .then(() => console.log('categorias adicionadas'))
            .catch((e)  => console.error('Erro ao incluir dados padrões de categorias'));
        }
      }).catch((e)  => console.error('Erro ao consultar a quantidade de categorias', e));
  }
}
