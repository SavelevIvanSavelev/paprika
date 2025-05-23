export interface Dimensions {
  unitOfMeasure: string;
  width: string;
  height: string;
  depth: string;
}

export interface Fixture {
  id: string;
  name: string;
  description: string;
  dimensions: Dimensions;
  presentationDepth: {
    unitOfMeasure: string;
    depth: string;
  };
  canBeCombinedFlag: boolean;
  canBeAllocatedFlag: boolean;
  obstructionFlag: boolean;
  dateValidFrom: string;
}

export interface Coordinates {
  unitOfMeasure: string;
  xCoordinate: string;
  yCoordinate: string;
  zCoordinate: string;
}

export interface Angle {
  unitOfMeasure: string;
  value: string;
}

export interface Placement {
  coordinates: Coordinates;
  angle: Angle;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Planogram {
  id: string;
  name: string;
  revisionType: string;
}

export interface Section {
  id: string;
  planogram: Planogram;
  productCategory: ProductCategory;
}

export interface FixturePlacement {
  id: string;
  fixture: {
    id: string;
    name: string;
    link: string;
  };
  placement: Placement;
  includedInSections: Section[];
  logicalFloorNumber: string;
  adjacency: {
    leftFixtureAdjacencyId: string;
    rightFixtureAdjacencyId: string;
  };
}

export interface FloorPlanPeriod {
  dateValidFrom: string;
  fixturePlacements: FixturePlacement[];
}

export interface Store {
  id: string;
  link: string;
}

export interface Format {
  id: string;
  link: string;
  name: string;
}

export interface FloorPlanResponse {
  store: Store;
  format: Format;
  floorPlanPeriods: FloorPlanPeriod[];
} 