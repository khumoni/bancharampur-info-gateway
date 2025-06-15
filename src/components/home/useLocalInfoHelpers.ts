
import { LocalInfoItem } from "@/types/localInfo";

export function getItemDisplay(item: LocalInfoItem): { title: string; subtitle: string } {
  switch (item.categoryId) {
    case "education":
      return {
        title: item.institutionName,
        subtitle: item.type,
      };
    case "health":
      return {
        title: item.name,
        subtitle: item.type,
      };
    case "private_health":
      return {
        title: item.name,
        subtitle: item.specialty,
      };
    case "transport":
      return {
        title: item.routeName,
        subtitle: item.type,
      };
    case "utilities":
      return {
        title: item.serviceType,
        subtitle: item.officeAddress,
      };
    case "weather":
      return {
        title: item.area,
        subtitle: item.temperature,
      };
    case "projects":
      return {
        title: item.projectName,
        subtitle: item.implementingAgency,
      };
    case "housing":
      return {
        title: item.projectName,
        subtitle: item.contact || item.details,
      };
    case "agriculture":
      return {
        title: item.serviceType,
        subtitle: item.details || item.contact,
      };
    case "jobs":
      return {
        title: item.title,
        subtitle: item.company,
      };
    case "scholarship":
      return {
        title: item.title,
        subtitle: item.provider,
      };
    case "legal":
      return {
        title: item.serviceName,
        subtitle: item.provider,
      };
    case "digital_services":
      return {
        title: item.centerName,
        subtitle: item.services,
      };
    case "culture":
      return {
        title: item.eventName,
        subtitle: item.location,
      };
    case "emergency_news":
      return {
        title: item.title,
        subtitle: item.date,
      };
    case "announcements":
      return {
        title: item.title,
        subtitle: item.date,
      };
    case "admin":
      return {
        title: item.officeName,
        subtitle: item.officerName,
      };
    default:
      return {
        title: "Unknown",
        subtitle: "",
      };
  }
}

