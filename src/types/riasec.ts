export type RiasecDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RiasecQuestion {
  id: number;
  dimension: RiasecDimension;
  dimensionTitle: string;
  statement: string;
  subtext: string;
}

export type LikertValue = 0 | 1 | 2 | 3;

export interface LikertOption {
  value: LikertValue;
  label: string;
  enLabel: string;
  scoreText: string;
  colorClass: string;
}

export interface DimensionInfo {
  code: RiasecDimension;
  nameId: string;
  nameEn: string;
  archetypeId: string;
  archetypeEn: string;
  color: string;
  accentGradient: string;
  description: string;
  coreTraits: string[];
  workEnvironment: string;
  sampleCareers: string[];
  recommendedMajors: string[];
}

export interface AssessmentResult {
  id: string;
  userName: string;
  userAge: number;
  timestamp: string;
  scores: Record<RiasecDimension, number>;
  maxPossibleScorePerDimension: number;
  percentages: Record<RiasecDimension, number>;
  sortedDimensions: {
    dimension: RiasecDimension;
    score: number;
    percentage: number;
    info: DimensionInfo;
  }[];
  topCode: string;
  primaryDimension: DimensionInfo;
  secondaryDimension: DimensionInfo;
  tertiaryDimension: DimensionInfo;
  answers: Record<number, LikertValue>;
}

export type ActiveView = 'home' | 'test' | 'result' | 'history' | 'about';
