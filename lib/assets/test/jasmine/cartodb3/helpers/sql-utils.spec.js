var SQLUtils = require('../../../../javascripts/cartodb3/helpers/sql-utils');

describe('helpers/sql-utils', function () {
  it('.isSameQuery', function () {
    expect(function () {
      SQLUtils.isSameQuery();
    }).toThrowError('Needed parameters not provided');
    expect(function () {
      SQLUtils.isSameQuery(null, '');
    }).toThrowError('Needed parameters not provided');
    expect(function () {
      SQLUtils.isSameQuery(undefined, '');
    }).toThrowError('Needed parameters not provided');
    expect(function () {
      SQLUtils.isSameQuery('', 'select * from paco');
    }).not.toThrow();
    expect(SQLUtils.isSameQuery('select * from bla', 'SELECT * from bla')).toBeTruthy();
    expect(SQLUtils.isSameQuery('select * FROM tablee;', 'select * from tablee')).toBeTruthy();
    expect(SQLUtils.isSameQuery('select * from "paco".bla', 'SELECT * from paco.bla')).toBeTruthy();
    expect(SQLUtils.isSameQuery('select * from paco-hey', 'select * from "paco-hey"')).toBeTruthy();
    expect(SQLUtils.isSameQuery('select * FROM cdb.paco-hey', 'select * from "cdb"."paco-hey"')).toBeTruthy();
    expect(SQLUtils.isSameQuery('select * FROM cdb-1.paco-hey', 'select * from "cdb-1"."paco-hey"')).toBeTruthy();
  });

  it('.altersSchema', function () {
    expect(SQLUtils.altersSchema('select * from blba')).toEqual(false);
    expect(SQLUtils.altersSchema('select create from table')).toEqual(false);
    expect(SQLUtils.altersSchema('select * from test wherw id=\'vacuum\'')).toEqual(false);

    expect(SQLUtils.altersSchema('insert into blaba values (1,2,3,4)')).toEqual(false);
    expect(SQLUtils.altersSchema('delete from bkna')).toEqual(false);
    expect(SQLUtils.altersSchema('update aaa set a = 1')).toEqual(false);

    expect(SQLUtils.altersSchema('vacuum full')).toEqual(true);
    expect(SQLUtils.altersSchema('exPlain     Analyze select * from test')).toEqual(true);
    expect(SQLUtils.altersSchema('grant update on foo to jerry')).toEqual(true);
    expect(SQLUtils.altersSchema('comment on foo \'this is crazy\'')).toEqual(true);
    expect(SQLUtils.altersSchema('revoke update on foo from jerry')).toEqual(true);
    expect(SQLUtils.altersSchema('reindex public.foo')).toEqual(true);
    expect(SQLUtils.altersSchema('cluster public.foo using foo_gidx')).toEqual(true);

    expect(SQLUtils.altersSchema('alter table add column blbla')).toEqual(true);
    expect(SQLUtils.altersSchema('alter schema.table add column blbla')).toEqual(true);

    expect(SQLUtils.altersSchema('create function')).toEqual(true);
    expect(SQLUtils.altersSchema('create or replace function')).toEqual(true);
    expect(SQLUtils.altersSchema('create index foo_idx on foo using gist(the_geom)')).toEqual(true);
    expect(SQLUtils.altersSchema('create index foo_idx on public.foo (cartodb_id)')).toEqual(true);
  });

  it('.altersData', function () {
    expect(SQLUtils.altersData('select * from blba')).toEqual(false);

    expect(SQLUtils.altersData('alter table add column blbla')).toEqual(true);
    expect(SQLUtils.altersData('vacuum full')).toEqual(true);

    expect(SQLUtils.altersData('refresh materialized view bar')).toEqual(true);
    expect(SQLUtils.altersData('truncate table')).toEqual(true);
    expect(SQLUtils.altersData('truncate schema.table')).toEqual(true);
    expect(SQLUtils.altersData('update aaa set a = 1')).toEqual(true);
    expect(SQLUtils.altersData('update table as whatvever set a = null')).toEqual(true);
    expect(SQLUtils.altersData('update  __ramen123123     set a = 1')).toEqual(true);
    expect(SQLUtils.altersData('insert into blaba values (1,2,3,4)')).toEqual(true);
    expect(SQLUtils.altersData('insert    into blaba values (1,2,3,4)')).toEqual(true);
    expect(SQLUtils.altersData('delete from bkna')).toEqual(true);
    expect(SQLUtils.altersData('update  schema.table  set a = 1')).toEqual(true);
    expect(SQLUtils.altersData('update  "schema".table  set a = 1')).toEqual(true);
    expect(SQLUtils.altersData('update  "schema"."table"  set a = 1')).toEqual(true);
    expect(SQLUtils.altersData('update  "schema-dash".table  set a = 1')).toEqual(true);
    expect(SQLUtils.altersData('update  "schema-dash"."table"  set a = 1')).toEqual(true);
    expect(SQLUtils.altersData('update  "schema-dash"."table" as at \n set a = 1')).toEqual(true);
  });

  it('.prependTableName', function () {
    expect(SQLUtils.prependTableName('SELECT * FROM paradas_metro_madrid', 'paradas_metro_madrid', 'pepe')).toBe('SELECT * FROM pepe.paradas_metro_madrid');
    expect(SQLUtils.prependTableName('SELECT * FROM pepe.paradas_metro_madrid', 'paradas_metro_madrid', 'pepe')).toBe('SELECT * FROM pepe.paradas_metro_madrid');
    expect(SQLUtils.prependTableName('SELECT * FROM foo_paradas_metro_madrid', 'paradas_metro_madrid', 'pepe')).toBe('SELECT * FROM foo_paradas_metro_madrid');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM paradas_metro_madrid,table2 WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM pepe.paradas_metro_madrid,table2 WHERE X=Y');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM table2,paradas_metro_madrid WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM table2,pepe.paradas_metro_madrid WHERE X=Y');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM pepe.paradas_metro_madrid,table2 WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM pepe.paradas_metro_madrid,table2 WHERE X=Y');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM table2,pepe.paradas_metro_madrid WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM table2,pepe.paradas_metro_madrid WHERE X=Y');
  });

  it('.prependTableName', function () {
    expect(SQLUtils.prependTableName('SELECT * FROM paradas_metro_madrid', 'paradas_metro_madrid', 'pepe')).toBe('SELECT * FROM pepe.paradas_metro_madrid');
    expect(SQLUtils.prependTableName('SELECT * FROM pepe.paradas_metro_madrid', 'paradas_metro_madrid', 'pepe')).toBe('SELECT * FROM pepe.paradas_metro_madrid');
    expect(SQLUtils.prependTableName('SELECT * FROM foo_paradas_metro_madrid', 'paradas_metro_madrid', 'pepe')).toBe('SELECT * FROM foo_paradas_metro_madrid');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM paradas_metro_madrid,table2 WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM pepe.paradas_metro_madrid,table2 WHERE X=Y');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM table2,paradas_metro_madrid WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM table2,pepe.paradas_metro_madrid WHERE X=Y');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM pepe.paradas_metro_madrid,table2 WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM pepe.paradas_metro_madrid,table2 WHERE X=Y');
    expect(SQLUtils.prependTableName('SELECT one, two, three FROM table2,pepe.paradas_metro_madrid WHERE X=Y', 'paradas_metro_madrid', 'pepe')).toBe('SELECT one, two, three FROM table2,pepe.paradas_metro_madrid WHERE X=Y');
  });

  it('.quoteIfNeeded', function () {
    expect(SQLUtils.quoteIfNeeded('pepe')).toBe('pepe');
    expect(SQLUtils.quoteIfNeeded('juanito_veinti3')).toBe('juanito_veinti3');
    expect(SQLUtils.quoteIfNeeded('my-hyphen')).toBe('"my-hyphen"');
  });
});
