export function compassDirection(abbreviation) {
  switch (abbreviation) {
    case 'N':
      return 'North';
    case 'NE':
      return 'Northeast';
    case 'E':
      return 'East';
    case 'SE':
      return 'Southeast';
    case 'S':
      return 'South';
    case 'SW':
      return 'Southwest';
    case 'W':
      return 'West';
    case 'NW':
      return 'Northwest';
    default:
      return abbreviation;
  }
}