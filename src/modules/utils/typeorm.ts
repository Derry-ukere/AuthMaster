import { BaseEntity, SelectQueryBuilder } from 'typeorm';

/* eslint-disable security/detect-object-injection */
export enum WcOperators {
  $or = '$or',
  $and = '$and',
  $in = '$in',
  $like = '$like',
}

export type WcOperatorTypes = 'AND' | 'OR';

type InOperator = string[] | number[];

type Values = String | Number | Date | boolean | String[] | Number[] | null | WhereOperators | undefined;

type AndOperator = {
  [x: string]: Values;
};

type OrOperator = {
  [x: string]: Values;
};

type WhereOperators = {
  $in?: InOperator;
  $or?: OrOperator;
  $and?: AndOperator;
  $like?: String;
};

type StartOperators = {
  $and?: AndOperator;
  $or?: OrOperator;
};

export type WhereAttributes =
  | {
      [x: string]: WhereOperators | Values;
    }
  | StartOperators;

export type WcObjectAny = {
  [x: string]: any;
};

interface OnClause {
  clause: string;
  parameters: {
    [x: string]: string;
  };
}

type MapTypes = 'one' | 'many';

type JoinTypes = 'left' | 'inner';

type RelationOptions = {
  key: string;
  alias?: string;
  entity: Function;
  mapType: MapTypes;
  joinType?: JoinTypes;
  on?: string | OnClause | WhereAttributes;
};

export type IModelIncludeOptions<T> = (T | RelationOptions)[];

export interface IModelOptions<T = string[]> {
  where: WhereAttributes;
  take?: number;
  skip?: number;
  orderBy?: {
    column: string;
    order: 'ASC' | 'DESC';
  };
  include?: IModelIncludeOptions<T>;
}

const isObject = (obj: any) => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;

/**
 * Generates where clause from an object
 *  This function was build for use with typeorm where clause types
 *
 * @param where
 * @param alias
 */
export const whereClauseFromObject = (where: WhereAttributes, alias?: string): { clause: string; parameters: Object } => {
  const parameters: WcObjectAny = {};

  /**
   * Get key name based on alias provided
   *
   * @param key
   */
  const getKeyName = (key: string) => `${alias ? `${alias}.` : ''}${key}`;

  const inClause = (keyAlias: string, key: string) => `${keyAlias} IN (:...${key})`;
  const eqClause = (keyAlias: string, key: string) => `${keyAlias} = :${key}`;
  const likeClause = (keyAlias: string, key: string) => `${keyAlias} LIKE :${key}`;

  /**
   * Generate clause for key based on operator
   *
   * @param key
   * @param value
   * @param operator
   */
  const genClause = (key: string, value: any, operator?: 'OR' | 'AND' | 'IN' | 'LIKE'): string => {
    const wheres: string[] = [];

    const keyName = getKeyName(key);

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '';
        }

        wheres.push(inClause(keyName, key));
        // Add parameters
        parameters[key] = value;
      } else {
        const wheres2: string[] = [];

        for (const val in value) {
          if (val in WcOperators) {
            if (val === WcOperators.$in) {
              if (!Array.isArray(value[val])) {
                throw 'For $IN operators, value must always be an array of values.';
              }

              wheres2.push(genClause(key, value[val], 'IN'));
            } else if (val === WcOperators.$like) {
              if (typeof value[val] !== 'string') {
                throw 'For $LIKE operators, value must always be a string.';
              }

              wheres2.push(genClause(key, value[val], 'LIKE'));
            } else {
              throw 'Only $IN and $LIKE operators are allowed in nested object.';
            }

            continue;
          }

          wheres2.push(genClause(val, value[val], operator));
        }

        wheres.push(wheres2.filter(Boolean).join(` ${operator?.toUpperCase()} `));
      }
    } else {
      if (operator === 'LIKE') {
        wheres.push(likeClause(keyName, key));
      } else {
        wheres.push(eqClause(keyName, key));
      }

      // Add parameters
      parameters[key] = value;
    }

    return wheres.filter(Boolean).join(` ${operator?.toUpperCase()} `);
  };
  /**
   * Sort operators and generate appropriate where clauses
   *
   * @param key
   * @param value
   */
  const sortOperators = (key: string, value: any): string[] => {
    const wheres: string[] = [];

    switch (key) {
      case WcOperators.$or:
        if (!isObject(value)) {
          throw 'For $OR operators, value must always be an object.';
        }

        wheres.push(genClause(key, value, 'OR'));
        break;
      case WcOperators.$in:
        if (!Array.isArray(value)) {
          throw 'For $IN operators, value must always be an array of values.';
        }

        wheres.push(genClause(key, value, 'IN'));
        break;
      case WcOperators.$like:
        wheres.push(genClause(key, value, 'LIKE'));
        break;
      default:
        wheres.push(genClause(key, value, 'AND'));
        break;
    }

    return wheres;
  };
  /**
   * Starting point
   *  Get all clauses,
   *
   * @param obj
   */
  const getClauses = (obj: WhereAttributes, operator: WcOperatorTypes = 'AND'): string[] => {
    const defaultClauses: string[] = [];
    const operatorClauses: WcObjectAny = {};

    if (Array.isArray(obj)) {
      throw 'Values cannot be an array without an $IN operator.';
    } else {
      for (const [key, value] of Object.entries(obj)) {
        if (key in WcOperators) {
          if (key === WcOperators.$and || key === WcOperators.$or) {
            operatorClauses[key] = getClauses(value, <WcOperatorTypes>key.replace('$', ''));
          }

          continue;
        }

        const wheres = sortOperators(key, value);

        wheres.filter(Boolean).forEach(clause => defaultClauses.push(clause));
      }
    }

    const cummDefaultClauses = [defaultClauses.join(` ${operator.toUpperCase()} `)];

    for (const op in operatorClauses) {
      cummDefaultClauses.push(operatorClauses[op].join(` ${op.replace('$', '').toUpperCase()} `));
    }

    return cummDefaultClauses;
  };

  /** Join all clauses */
  const clauses = getClauses(where)
    .map(cl => cl.trim())
    .filter(Boolean);

  let clause = '';

  if (clauses.length > 1) {
    clause = clauses.map(cl => `(${cl})`).join(' AND ');
  } else {
    clause = clauses.join();
  }

  if (clause.trim() === '') {
    throw 'Security error: Where clauses are expected to be used, they cannot be empty.';
  }

  return {
    clause,
    parameters,
  };
};

/**
 * Apply relations to typeorm query builder
 *
 * @param qb
 * @param alias
 * @param include
 * @param joinColumn
 */
export const applyTypeormRelations = <T extends BaseEntity, K extends SelectQueryBuilder<T>>(
  qb: K,
  alias: string,
  include?: IModelIncludeOptions<string>,
  joinColumn?: string,
): K => {
  if (!include) {
    return qb;
  }

  include.forEach(tbl => {
    joinColumn = joinColumn || 'id';

    if ('object' === typeof tbl) {
      const joinAlias = tbl.alias || tbl.key;

      let joinOn = `${joinAlias}.${joinColumn} = ${alias}.${joinColumn}`,
        params;

      if ('string' === typeof tbl.on) {
        joinOn = tbl.on;
      }

      if ('object' === typeof tbl.on) {
        const { clause, parameters } = tbl.on as any;

        if (clause) {
          joinOn = clause;
          params = parameters || {};
        } else {
          const { clause, parameters } = whereClauseFromObject(tbl.on as WhereAttributes, joinAlias);
          joinOn = clause;
          params = parameters;
        }
      }

      if (tbl.mapType === 'one') {
        if (tbl.joinType === 'inner') {
          qb.innerJoinAndMapOne(`${alias}.${tbl.key}`, tbl.entity, joinAlias, joinOn, params);
        } else {
          qb.leftJoinAndMapOne(`${alias}.${tbl.key}`, tbl.entity, joinAlias, joinOn, params);
        }
      }

      if (tbl.mapType === 'many') {
        if (tbl.joinType === 'inner') {
          qb.innerJoinAndMapMany(`${alias}.${tbl.key}`, tbl.entity, joinAlias, joinOn, params);
        } else {
          qb.leftJoinAndMapMany(`${alias}.${tbl.key}`, tbl.entity, joinAlias, joinOn, params);
        }
      }

      return;
    }

    const [tblOn, joinType] = tbl
      .split('.')
      .map(str => str.trim())
      .filter(Boolean);

    if (joinType === 'inner') {
      qb.innerJoinAndMapMany(`${alias}.${tblOn}`, tblOn, tblOn, `${tblOn}.${joinColumn} = ${alias}.${joinColumn}`);
    } else {
      qb.leftJoinAndMapMany(`${alias}.${tblOn}`, tblOn, tblOn, `${tblOn}.${joinColumn} = ${alias}.${joinColumn}`);
    }
  });

  return qb;
};
