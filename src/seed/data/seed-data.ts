export interface Welcome {
  ID: string;
  TIPO_PRENDA: TipoPrenda;
  TALLA: Talla;
  COLOR: Color;
  CANTIDAD_DISPONIBLE: number;
  PRECIO_50_U: number;
  PRECIO_100_U: number;
  PRECIO_200_U: number;
  DISPONIBLE: Disponible;
  CATEGORÍA: Categoría;
  DESCRIPCIÓN: Descripción;
}

export enum Categoría {
  Casual = 'Casual',
  Deportivo = 'Deportivo',
  Formal = 'Formal',
}

export enum Color {
  Amarillo = 'Amarillo',
  Azul = 'Azul',
  Blanco = 'Blanco',
  Gris = 'Gris',
  Negro = 'Negro',
  Rojo = 'Rojo',
  Verde = 'Verde',
}

export enum Descripción {
  DiseñoModernoYElegante = 'Diseño moderno y elegante.',
  IdealParaUsoDiario = 'Ideal para uso diario.',
  MaterialDeAltaCalidad = 'Material de alta calidad.',
  PerfectaParaActividadesAlAireLibre = 'Perfecta para actividades al aire libre.',
  PrendaCómodaYLigera = 'Prenda cómoda y ligera.',
}

export enum Disponible {
  No = 'No',
  Sí = 'Sí',
}

export enum Talla {
  L = 'L',
  M = 'M',
  S = 'S',
  Xl = 'XL',
  Xxl = 'XXL',
}

export enum TipoPrenda {
  Camisa = 'Camisa',
  Camiseta = 'Camiseta',
  Chaqueta = 'Chaqueta',
  Falda = 'Falda',
  Pantalón = 'Pantalón',
  Sudadera = 'Sudadera',
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWelcome(json: string): Welcome[] {
    return cast(JSON.parse(json), a(r('Welcome')));
  }

  public static welcomeToJson(value: Welcome[]): string {
    return JSON.stringify(uncast(value, a(r('Welcome'))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = '',
  parent: any = '',
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty('props')
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Welcome: o(
    [
      { json: 'ID', js: 'ID', typ: '' },
      { json: 'TIPO_PRENDA', js: 'TIPO_PRENDA', typ: r('TipoPrenda') },
      { json: 'TALLA', js: 'TALLA', typ: r('Talla') },
      { json: 'COLOR', js: 'COLOR', typ: r('Color') },
      { json: 'CANTIDAD_DISPONIBLE', js: 'CANTIDAD_DISPONIBLE', typ: 0 },
      { json: 'PRECIO_50_U', js: 'PRECIO_50_U', typ: 0 },
      { json: 'PRECIO_100_U', js: 'PRECIO_100_U', typ: 0 },
      { json: 'PRECIO_200_U', js: 'PRECIO_200_U', typ: 0 },
      { json: 'DISPONIBLE', js: 'DISPONIBLE', typ: r('Disponible') },
      { json: 'CATEGORÍA', js: 'CATEGORÍA', typ: r('Categoría') },
      { json: 'DESCRIPCIÓN', js: 'DESCRIPCIÓN', typ: r('Descripción') },
    ],
    false,
  ),
  Categoría: ['Casual', 'Deportivo', 'Formal'],
  Color: ['Amarillo', 'Azul', 'Blanco', 'Gris', 'Negro', 'Rojo', 'Verde'],
  Descripción: [
    'Diseño moderno y elegante.',
    'Ideal para uso diario.',
    'Material de alta calidad.',
    'Perfecta para actividades al aire libre.',
    'Prenda cómoda y ligera.',
  ],
  Disponible: ['No', 'Sí'],
  Talla: ['L', 'M', 'S', 'XL', 'XXL'],
  TipoPrenda: [
    'Camisa',
    'Camiseta',
    'Chaqueta',
    'Falda',
    'Pantalón',
    'Sudadera',
  ],
};
