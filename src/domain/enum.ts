/**
 * Defines the possible types for a visit report.
 */
export enum VisitReportType {
  VideoCall = 'VideoCall',
  ExternalVisit = 'ExternalVisit',
  InternalVisit = 'InternalVisit',
  Expo = 'Expo',
}

/**
 * Defines the possible statuses for tasks and visit reports.
 */
export enum Status {
  Open = 'Open',
  InProgress = 'InProgress',
  Closed = 'Closed',
}

/**
 * Defines the possible outcomes of a visit report.
 */
export enum VisitReportOutcome {
  Negative = 'Negative',
  Normal = 'Normal',
  Positive = 'Positive',
  VeryPositive = 'VeryPositive',
}
