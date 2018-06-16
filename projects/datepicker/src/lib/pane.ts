export interface Pane {
  readonly order: number;
  readonly values: ReadonlyArray<number>;
  readonly indent?: number;
}
