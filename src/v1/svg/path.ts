export type Path = (commands: Array<string>) => string;
export const path: Path = commands => commands.join(' ');
