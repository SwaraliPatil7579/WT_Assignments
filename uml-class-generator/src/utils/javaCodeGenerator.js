/**
 * Java Code Generator
 * Converts UML diagram nodes & edges into valid Java source code.
 */

const VISIBILITY_MAP = {
  '+': 'public',
  '-': 'private',
  '#': 'protected',
  '~': '',
};

/**
 * Generate Java source code for all classes in the diagram.
 * @param {Array} nodes - React Flow nodes with class data
 * @param {Array} edges - React Flow edges with relationship data
 * @returns {Array<{className: string, code: string}>} Array of file objects
 */
export function generateJavaCode(nodes, edges) {
  if (!nodes || nodes.length === 0) return [];

  const classMap = new Map();
  nodes.forEach((node) => {
    classMap.set(node.id, node.data);
  });

  // Build relationship maps
  const extendsMap = new Map();   // childId -> parentClassName
  const implementsMap = new Map(); // classId -> [interfaceNames]
  const compositionMap = new Map(); // classId -> [{name, type}]
  const aggregationMap = new Map(); // classId -> [{name, type}]

  edges.forEach((edge) => {
    const relType = edge.data?.relationshipType || 'association';
    const sourceData = classMap.get(edge.source);
    const targetData = classMap.get(edge.target);
    if (!sourceData || !targetData) return;

    switch (relType) {
      case 'inheritance':
        extendsMap.set(edge.source, targetData.name);
        break;
      case 'implementation':
        if (!implementsMap.has(edge.source)) implementsMap.set(edge.source, []);
        implementsMap.get(edge.source).push(targetData.name);
        break;
      case 'composition': {
        if (!compositionMap.has(edge.source)) compositionMap.set(edge.source, []);
        compositionMap.get(edge.source).push({
          name: toLowerFirst(targetData.name),
          type: targetData.name,
        });
        break;
      }
      case 'aggregation': {
        if (!aggregationMap.has(edge.source)) aggregationMap.set(edge.source, []);
        aggregationMap.get(edge.source).push({
          name: toLowerFirst(targetData.name),
          type: targetData.name,
        });
        break;
      }
      default:
        break;
    }
  });

  const files = [];

  nodes.forEach((node) => {
    const data = node.data;
    const lines = [];
    const imports = new Set();

    // Determine class declaration
    const extendsClass = extendsMap.get(node.id);
    const implementsList = implementsMap.get(node.id) || [];
    const compositions = compositionMap.get(node.id) || [];
    const aggregations = aggregationMap.get(node.id) || [];

    // Check if we need List import
    if (aggregations.length > 0) {
      imports.add('java.util.List');
      imports.add('java.util.ArrayList');
    }

    // Imports
    if (imports.size > 0) {
      imports.forEach((imp) => lines.push(`import ${imp};`));
      lines.push('');
    }

    // Class/Interface/Enum declaration
    const keyword = getKeyword(data.stereotype);
    const hasAbstractMethod = data.methods?.some((m) => m.methodType === 'abstract');
    const isAbstract = data.stereotype === 'abstract' || (data.stereotype === 'class' && hasAbstractMethod);
    const modifiers = isAbstract ? 'public abstract' : 'public';

    let declaration = `${modifiers} ${keyword} ${data.name}`;
    if (extendsClass) declaration += ` extends ${extendsClass}`;
    if (implementsList.length > 0) declaration += ` implements ${implementsList.join(', ')}`;
    declaration += ' {';

    lines.push(declaration);
    lines.push('');

    if (data.stereotype === 'enum') {
      // Enum values — attributes become enum constants
      if (data.attributes.length > 0) {
        const enumValues = data.attributes.map((a) => a.name.toUpperCase()).join(',\n    ');
        lines.push(`    ${enumValues};`);
        lines.push('');
      }
    } else {
      // Fields from attributes
      data.attributes.forEach((attr) => {
        const vis = VISIBILITY_MAP[attr.visibility] || 'private';
        const visStr = vis ? `${vis} ` : '';
        lines.push(`    ${visStr}${attr.type} ${attr.name};`);
      });

      // Fields from composition relationships
      compositions.forEach((comp) => {
        lines.push(`    private ${comp.type} ${comp.name};`);
      });

      // Fields from aggregation relationships
      aggregations.forEach((agg) => {
        lines.push(`    private List<${agg.type}> ${agg.name}List;`);
      });

      if (data.attributes.length > 0 || compositions.length > 0 || aggregations.length > 0) {
        lines.push('');
      }

      // Default constructor (skip if interface or only abstract methods)
      if (data.stereotype !== 'interface') {
        lines.push(`    public ${data.name}() {`);
        aggregations.forEach((agg) => {
          lines.push(`        this.${agg.name}List = new ArrayList<>();`);
        });
        lines.push('    }');
        lines.push('');

        // Parameterized constructor (if attributes exist)
        if (data.attributes.length > 0) {
          const params = data.attributes
            .map((a) => `${a.type} ${a.name}`)
            .join(', ');
          lines.push(`    public ${data.name}(${params}) {`);
          data.attributes.forEach((a) => {
            lines.push(`        this.${a.name} = ${a.name};`);
          });
          lines.push('    }');
          lines.push('');
        }
      }

      // Methods
      data.methods.forEach((method) => {
        const vis = VISIBILITY_MAP[method.visibility] || 'public';
        const visStr = vis ? `${vis} ` : '';
        const params = method.params || '';
        const returnType = method.returnType || 'void';
        const kind = method.methodType || (data.stereotype === 'abstract' ? 'abstract' : 'standard');

        if (data.stereotype === 'interface') {
          if (kind === 'default') {
            lines.push(`    default ${returnType} ${method.name}(${params}) {`);
            if (returnType !== 'void') {
              lines.push(`        return ${getDefaultReturn(returnType)};`);
            }
            lines.push('    }');
          } else if (kind === 'static') {
            lines.push(`    static ${returnType} ${method.name}(${params}) {`);
            if (returnType !== 'void') {
              lines.push(`        return ${getDefaultReturn(returnType)};`);
            }
            lines.push('    }');
          } else {
            lines.push(`    ${returnType} ${method.name}(${params});`);
          }
        } else {
          // Class or Abstract Class
          if (kind === 'abstract') {
            lines.push(`    ${visStr}abstract ${returnType} ${method.name}(${params});`);
          } else if (kind === 'static') {
            lines.push(`    ${visStr}static ${returnType} ${method.name}(${params}) {`);
            if (returnType !== 'void') {
              lines.push(`        return ${getDefaultReturn(returnType)};`);
            }
            lines.push('    }');
          } else if (kind === 'final') {
            lines.push(`    ${visStr}final ${returnType} ${method.name}(${params}) {`);
            if (returnType !== 'void') {
              lines.push(`        return ${getDefaultReturn(returnType)};`);
            }
            lines.push('    }');
          } else {
            lines.push(`    ${visStr}${returnType} ${method.name}(${params}) {`);
            if (returnType !== 'void') {
              lines.push(`        return ${getDefaultReturn(returnType)};`);
            }
            lines.push('    }');
          }
        }
        lines.push('');
      });

      // Getters and setters for private fields
      data.attributes
        .filter((a) => a.visibility === '-')
        .forEach((attr) => {
          const capName = toUpperFirst(attr.name);
          // Getter
          lines.push(`    public ${attr.type} get${capName}() {`);
          lines.push(`        return this.${attr.name};`);
          lines.push('    }');
          lines.push('');
          // Setter
          lines.push(`    public void set${capName}(${attr.type} ${attr.name}) {`);
          lines.push(`        this.${attr.name} = ${attr.name};`);
          lines.push('    }');
          lines.push('');
        });
    }

    lines.push('}');

    files.push({
      className: data.name,
      code: lines.join('\n'),
    });
  });

  return files;
}

function getKeyword(stereotype) {
  switch (stereotype) {
    case 'interface': return 'interface';
    case 'enum': return 'enum';
    default: return 'class';
  }
}

function getDefaultReturn(type) {
  switch (type) {
    case 'int':
    case 'long':
    case 'short':
    case 'byte':
      return '0';
    case 'double':
    case 'float':
      return '0.0';
    case 'boolean':
      return 'false';
    case 'char':
      return "'\\0'";
    case 'String':
      return '""';
    default:
      return 'null';
  }
}

function toUpperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toLowerFirst(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
