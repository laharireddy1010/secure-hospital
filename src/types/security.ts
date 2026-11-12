export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type NodeZone = 'clinical' | 'core' | 'security';

export interface TopologyNode {
  id: string;
  name: string;
  shortName: string;
  zone: NodeZone;
  x: number;
  y: number;
  ipSubnet: string;
  vlan: string;
  connectedDevices: number;
  status: 'Secure' | 'Protected' | 'Elevated Watch';
  latencyMs: number;
  protocols: string[];
  ospfArea: string;
  description: string;
  securityNote: string;
}

export interface TopologyLink {
  id: string;
  from: string;
  to: string;
  encrypted: boolean;
  bandwidth: string;
}

export interface AlgorithmInfo {
  id: 'aes' | 'rsa' | 'sha256' | 'dijkstra' | 'ospf' | 'ids' | 'rbac';
  name: string;
  fullName: string;
  category: string;
  shortSummary: string;
  hospitalPurpose: string;
  howItWorks: string;
  demoLabel: string;
  accent: string;
}

export interface IdsEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  targetDepartment: string;
  eventTitle: string;
  category: string;
  severity: ThreatSeverity;
  packetSummary: string;
  recommendedAction: string;
  scanResult: 'Blocked' | 'Quarantined' | 'Flagged' | 'Allowed';
  isThreat: boolean;
}

export interface RoutingNode {
  id: string;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  ospfArea: string;
  kind: 'department' | 'security' | 'server';
}

export interface RoutingEdge {
  id: string;
  from: string;
  to: string;
  cost: number;
  bandwidth: string;
}

export type RbacRoleId = 'doctor' | 'nurse' | 'admin' | 'lab_tech';

export interface RbacResourcePermission {
  resourceId: string;
  resourceName: string;
  category: string;
  sensitivity: 'Confidential' | 'Restricted' | 'Internal' | 'Critical Infrastructure';
  allowed: boolean;
  accessLevel: string;
  rationale: string;
}

export interface RbacRoleProfile {
  id: RbacRoleId;
  title: string;
  department: string;
  clearanceLevel: string;
  summary: string;
  permissions: RbacResourcePermission[];
}

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  department: string;
  eventType: string;
  severity: ThreatSeverity;
  actionTaken: string;
  status: 'Blocked' | 'Mitigated' | 'Verified' | 'Allowed';
  sourceIp: string;
}

export interface ArchitectureLayer {
  layerNumber: number;
  title: string;
  subtitle: string;
  protocols: string[];
  explanation: string;
  accentColor: string;
}

