
export interface BaseInfoItem {
  id: string;
  categoryId: string;
  icon: string;
  district: string;
  upazila: string;
}

export interface EducationInfo extends BaseInfoItem {
  categoryId: 'education';
  institutionName: string;
  type: 'school' | 'college' | 'university' | 'madrasha';
  address: string;
  contact: string;
}

export interface HealthInfo extends BaseInfoItem {
  categoryId: 'health';
  name: string;
  type: 'hospital' | 'clinic' | 'diagnostic' | 'pharmacy';
  address: string;
  phone: string;
  services: string;
}

export interface TransportInfo extends BaseInfoItem {
  categoryId: 'transport';
  routeName: string;
  type: 'bus' | 'train' | 'auto-rickshaw';
  schedule: string;
  fare: string;
}

export interface AdministrativeInfo extends BaseInfoItem {
  categoryId: 'admin';
  officeName: string;
  officerName: string;
  designation: string;
  contact: string;
}

export interface UtilitiesInfo extends BaseInfoItem {
  categoryId: 'utilities';
  serviceType: 'electricity' | 'gas' | 'water';
  officeAddress: string;
  complaintNumber: string;
}

export interface WeatherInfo extends BaseInfoItem {
  categoryId: 'weather';
  area: string;
  temperature: string;
  humidity: string;
  alert: string;
}

export interface ProjectInfo extends BaseInfoItem {
  categoryId: 'projects';
  projectName: string;
  implementingAgency: string;
  budget: string;
  status: 'ongoing' | 'completed' | 'planned';
}

export interface AnnouncementInfo extends BaseInfoItem {
  categoryId: 'announcements';
  title: string;
  details: string;
  date: string;
}

// Newly Added Info Types
export interface ScholarshipInfo extends BaseInfoItem {
  categoryId: 'scholarship';
  title: string;
  provider: string;
  eligibility: string;
  deadline: string;
}

export interface LegalAidInfo extends BaseInfoItem {
  categoryId: 'legal';
  serviceName: string;
  provider: string;
  address: string;
  contact: string;
}

export interface AgricultureInfo extends BaseInfoItem {
  categoryId: 'agriculture';
  serviceType: string;
  details: string;
  contact: string;
}

export interface HousingInfo extends BaseInfoItem {
  categoryId: 'housing';
  projectName: string;
  details: string;
  contact: string;
}

export interface DigitalServiceInfo extends BaseInfoItem {
  categoryId: 'digital_services';
  centerName: string;
  services: string;
  address: string;
  contact: string;
}

export interface CultureInfo extends BaseInfoItem {
  categoryId: 'culture';
  eventName: string;
  date: string;
  location: string;
  details: string;
}

export interface PrivateHealthInfo extends BaseInfoItem {
  categoryId: 'private_health';
  name: string;
  type: 'clinic' | 'diagnostic';
  specialty: string;
  address: string;
  contact: string;
}

export interface EmergencyNewsInfo extends BaseInfoItem {
  categoryId: 'emergency_news';
  title: string;
  details: string;
  date: string;
}

export interface JobInfo extends BaseInfoItem {
  categoryId: 'jobs';
  title: string;
  company: string;
  location: string;
  deadline: string;
}

export type LocalInfoItem = 
  | EducationInfo 
  | HealthInfo 
  | TransportInfo 
  | AdministrativeInfo 
  | UtilitiesInfo 
  | WeatherInfo 
  | ProjectInfo 
  | AnnouncementInfo
  | ScholarshipInfo 
  | LegalAidInfo 
  | AgricultureInfo 
  | HousingInfo 
  | DigitalServiceInfo 
  | CultureInfo 
  | PrivateHealthInfo 
  | EmergencyNewsInfo 
  | JobInfo;
