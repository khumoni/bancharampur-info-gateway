import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  MessageSquare, 
  Image, 
  FileText, 
  Calculator,
  Globe,
  Zap,
  Plus,
  Settings,
  ExternalLink,
  Trash2
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

interface ThirdPartyToolsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'ai' | 'productivity' | 'media' | 'utility';
  isEnabled: boolean;
  apiKey?: string;
  webhookUrl?: string;
}

export const ThirdPartyTools = ({ isOpen, onOpenChange }: ThirdPartyToolsProps) => {
  const { language } = useApp();
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const [tools, setTools] = useState<Tool[]>([
    {
      id: 'chatgpt',
      name: 'ChatGPT',
      description: language === 'bn' ? 'AI চ্যাট সহায়ক' : 'AI Chat Assistant',
      icon: Bot,
      category: 'ai',
      isEnabled: false,
      apiKey: ''
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: language === 'bn' ? 'Google এর AI সহায়ক' : 'Google AI Assistant',
      icon: Bot,
      category: 'ai',
      isEnabled: false,
      apiKey: ''
    },
    {
      id: 'dalle',
      name: 'DALL-E',
      description: language === 'bn' ? 'AI ছবি জেনারেটর' : 'AI Image Generator',
      icon: Image,
      category: 'media',
      isEnabled: false,
      apiKey: ''
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: language === 'bn' ? 'অটোমেশন টুল' : 'Automation Tool',
      icon: Zap,
      category: 'productivity',
      isEnabled: false,
      webhookUrl: ''
    },
    {
      id: 'translator',
      name: 'Google Translate',
      description: language === 'bn' ? 'ভাষা অনুবাদক' : 'Language Translator',
      icon: Globe,
      category: 'utility',
      isEnabled: false,
      apiKey: ''
    }
  ]);

  const toggleTool = (toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, isEnabled: !tool.isEnabled } : tool
    ));
  };

  const updateToolConfig = (toolId: string, key: string, value: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, [key]: value } : tool
    ));
  };

  const categories = [
    { id: 'all', label: language === 'bn' ? 'সব' : 'All' },
    { id: 'ai', label: language === 'bn' ? 'AI টুলস' : 'AI Tools' },
    { id: 'productivity', label: language === 'bn' ? 'উৎপাদনশীলতা' : 'Productivity' },
    { id: 'media', label: language === 'bn' ? 'মিডিয়া' : 'Media' },
    { id: 'utility', label: language === 'bn' ? 'ইউটিলিটি' : 'Utility' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  const enabledTools = tools.filter(tool => tool.isEnabled);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>{language === 'bn' ? 'তৃতীয় পক্ষের টুলস' : 'Third-party Tools'}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">
              {language === 'bn' ? 'উপলব্ধ টুলস' : 'Available Tools'}
            </TabsTrigger>
            <TabsTrigger value="enabled">
              {language === 'bn' ? 'সক্রিয় টুলস' : 'Enabled Tools'} ({enabledTools.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <tool.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{tool.name}</CardTitle>
                          <CardDescription className="text-sm">{tool.description}</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={tool.isEnabled}
                        onCheckedChange={() => toggleTool(tool.id)}
                      />
                    </div>
                  </CardHeader>
                  
                  {tool.isEnabled && (
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {tool.apiKey !== undefined && (
                          <div>
                            <label className="text-sm font-medium">API Key</label>
                            <Input
                              type="password"
                              placeholder="Enter API key..."
                              value={tool.apiKey}
                              onChange={(e) => updateToolConfig(tool.id, 'apiKey', e.target.value)}
                            />
                          </div>
                        )}
                        {tool.webhookUrl !== undefined && (
                          <div>
                            <label className="text-sm font-medium">Webhook URL</label>
                            <Input
                              type="url"
                              placeholder="Enter webhook URL..."
                              value={tool.webhookUrl}
                              onChange={(e) => updateToolConfig(tool.id, 'webhookUrl', e.target.value)}
                            />
                          </div>
                        )}
                        <Button size="sm" variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          {language === 'bn' ? 'কনফিগার করুন' : 'Configure'}
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="enabled" className="space-y-4">
            {enabledTools.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'bn' ? 'কোন টুল সক্রিয় নেই' : 'No Tools Enabled'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'bn' 
                    ? 'টুলস সক্রিয় করতে "উপলব্ধ টুলস" ট্যাবে যান' 
                    : 'Go to "Available Tools" tab to enable tools'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {enabledTools.map((tool) => (
                  <Card key={tool.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <tool.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {language === 'bn' ? 'সক্রিয়' : 'Active'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setSelectedTool(tool)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toggleTool(tool.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};