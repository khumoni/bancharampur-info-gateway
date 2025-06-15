import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { useApp } from "@/contexts/AppContext";
import { EducationInfo, HealthInfo, TransportInfo, AdministrativeInfo, UtilitiesInfo, WeatherInfo, ProjectInfo, AnnouncementInfo, ScholarshipInfo, LegalAidInfo, AgricultureInfo, HousingInfo, DigitalServiceInfo, CultureInfo, PrivateHealthInfo, EmergencyNewsInfo, JobInfo, LocalInfoItem } from "@/types/localInfo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { t } from "@/lib/translations";
import { Link } from 'lucide-react';

export default function LocalInfo() {
  const { localInfoItems } = useData();
  const { language } = useApp();

  const educationItems = localInfoItems.filter((item): item is EducationInfo => item.categoryId === 'education');
  const healthItems = localInfoItems.filter((item): item is HealthInfo => item.categoryId === 'health');
  const transportItems = localInfoItems.filter((item): item is TransportInfo => item.categoryId === 'transport');
  const administrativeItems = localInfoItems.filter((item): item is AdministrativeInfo => item.categoryId === 'admin');
  const utilitiesItems = localInfoItems.filter((item): item is UtilitiesInfo => item.categoryId === 'utilities');
  const weatherItems = localInfoItems.filter((item): item is WeatherInfo => item.categoryId === 'weather');
  const projectItems = localInfoItems.filter((item): item is ProjectInfo => item.categoryId === 'projects');
  const announcementItems = localInfoItems.filter((item): item is AnnouncementInfo => item.categoryId === 'announcements');
  const scholarshipItems = localInfoItems.filter((item): item is ScholarshipInfo => item.categoryId === 'scholarship');
  const legalAidItems = localInfoItems.filter((item): item is LegalAidInfo => item.categoryId === 'legal');
  const agricultureItems = localInfoItems.filter((item): item is AgricultureInfo => item.categoryId === 'agriculture');
  const housingItems = localInfoItems.filter((item): item is HousingInfo => item.categoryId === 'housing');
  const digitalServiceItems = localInfoItems.filter((item): item is DigitalServiceInfo => item.categoryId === 'digital_services');
    const cultureItems = localInfoItems.filter((item): item is CultureInfo => item.categoryId === 'culture');
    const privateHealthItems = localInfoItems.filter((item): item is PrivateHealthInfo => item.categoryId === 'private_health');
    const emergencyNewsItems = localInfoItems.filter((item): item is EmergencyNewsInfo => item.categoryId === 'emergency_news');
    const jobItems = localInfoItems.filter((item): item is JobInfo => item.categoryId === 'jobs');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{t("localInformation", language)}</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("education", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <ul>
                {educationItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.institutionName} - {item.type}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("health", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <ul>
                {healthItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.name} - {item.type}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("transport", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <ul>
                {transportItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.routeName} - {item.type}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <ul>
                {administrativeItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.officeName} - {item.officerName}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("utilities", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <ul>
                {utilitiesItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.serviceType} - {item.officeAddress}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("weather", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <ul>
                {weatherItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.area} - {item.temperature}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("projects", language)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full">
              <ul>
                {projectItems.map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.projectName} - {item.implementingAgency}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("announcements", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {announcementItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.title} - {item.date}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("scholarships", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {scholarshipItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.title} - {item.provider}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("legal", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {legalAidItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.serviceName} - {item.provider}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("agriculture", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {agricultureItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.serviceType} - {item.contact}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("housing", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {housingItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.projectName} - {item.contact}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("digital_services", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {digitalServiceItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.centerName} - {item.services}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
              
               <Card>
                <CardHeader>
                  <CardTitle>{t("culture", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {cultureItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.eventName} - {item.location}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("private_health", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {privateHealthItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.name} - {item.specialty}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("emergency_news", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {emergencyNewsItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.title} - {item.date}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("jobs", language)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full">
                    <ul>
                      {jobItems.map((item) => (
                        <li key={item.id} className="mb-2">
                          {item.title} - {item.company}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
      </div>
    </div>
  );
}
