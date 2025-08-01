
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import { 
  Github, 
  ExternalLink, 
  Download, 
  Star, 
  Users, 
  GitBranch, 
  Copy, 
  Check,
  ChevronRight,
  Zap,
  Code,
  Globe,
  ArrowRight
} from 'lucide-react';
import type { LandingPageData } from '../../server/src/schema';

function App() {
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadLandingData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await trpc.getLandingPageData.query();
      setLandingData(data);
    } catch (error) {
      console.error('Failed to load landing page data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLandingData();
  }, [loadLandingData]);

  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(identifier);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!landingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Failed to load landing page data</div>
      </div>
    );
  }

  const { hero, community_stats, roadmap } = landingData;

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Elusion Labs
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#sdks" className="text-gray-300 hover:text-white transition-colors">SDKs</a>
              <a href="#roadmap" className="text-gray-300 hover:text-white transition-colors">Roadmap</a>
              <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
              <Button variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent leading-tight">
              {hero.headline}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              {hero.subheadline}
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              {hero.mission_statement}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-3 text-lg font-semibold"
              >
                {hero.primary_cta_text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg"
              >
                <Github className="w-5 h-5 mr-2" />
                {hero.secondary_cta_text}
              </Button>
            </div>
          </div>

          {/* Hero Code Example */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Before</h3>
                      <Badge variant="outline" className="border-red-400/30 text-red-400">Complex</Badge>
                    </div>
                    <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                      <pre className="text-gray-300">
{`import requests
import json

# Raw API integration
response = requests.post(
    'https://api.zenopay.com/v1/orders',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    data=json.dumps({
        'amount': 1000,
        'currency': 'USD',
        'customer_id': '123'
    })
)

if response.status_code == 200:
    order = response.json()
else:
    # Handle errors manually
    error = response.json()
    raise Exception(error['message'])`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider">After</h3>
                      <Badge variant="outline" className="border-green-400/30 text-green-400">Simple</Badge>
                    </div>
                    <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                      <pre className="text-gray-300">
{`from zenopay import ZenoPay

# Clean SDK integration
client = ZenoPay(api_key="your_key")

# Type-safe order creation
order = client.orders.create(
    amount=1000,
    currency="USD",
    customer_id="123"
)

# Automatic error handling
# Built-in retries
# Full type safety`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Why We Build
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Developer Pain Points</h3>
              <p className="text-gray-400">
                We've experienced the frustration of poorly designed APIs. Our SDKs eliminate boilerplate and provide intuitive interfaces.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Community Driven</h3>
              <p className="text-gray-400">
                Built by developers, for developers. Every SDK is open source and shaped by community feedback and contributions.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Global Impact</h3>
              <p className="text-gray-400">
                Starting with African fintech APIs, we're expanding globally to make quality integrations accessible everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured SDK Showcase */}
      <section id="sdks" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured SDK
            </h2>
            <p className="text-xl text-gray-400">Production-ready Python SDKs for modern developers</p>
          </div>

          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">ZenoPay Python SDK</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Complete payment processing integration for African fintech
                  </CardDescription>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">v1.2.0</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Features Grid */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Key Features</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Order Management', icon: '📦' },
                    { name: 'Disbursements', icon: '💸' },
                    { name: 'Checkout Sessions', icon: '🛒' },
                    { name: 'Webhook Handling', icon: '🔗' }
                  ].map((feature, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-gray-800">
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="text-white font-medium">{feature.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installation */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Installation</h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">pip install zenopay-sdk</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('pip install zenopay-sdk', 'install')}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    >
                      {copiedCode === 'install' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Example */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Quick Start</h3>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm border border-gray-800">
                  <pre className="text-gray-300">
{`from zenopay import ZenoPay

client = ZenoPay(api_key="your_api_key")

# Create a payment
payment = client.payments.create(
    amount=1000,
    currency="USD",
    customer_email="user@example.com"
)

print(f"Payment ID: {payment.id}")
print(f"Status: {payment.status}")`}
                  </pre>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-2" />
                  PyPI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community & Stats */}
      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Open Source & Community Driven
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              All our SDKs are free, open source, and built with the community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{community_stats.github_stars.toLocaleString()}</div>
                <div className="text-gray-400">GitHub Stars</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardContent className="p-6">
                <Download className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{community_stats.total_downloads.toLocaleString()}</div>
                <div className="text-gray-400">Total Downloads</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{community_stats.contributors}</div>
                <div className="text-gray-400">Contributors</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 text-center">
              <CardContent className="p-6">
                <GitBranch className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{community_stats.repositories}</div>
                <div className="text-gray-400">Repositories</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-3 text-lg font-semibold">
              <Github className="w-5 h-5 mr-2" />
              Contribute on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              What's Next
            </h2>
            <p className="text-xl text-gray-400">
              Our roadmap is shaped by community needs and feedback
            </p>
          </div>

          <div className="space-y-6">
            {/* Use real roadmap data if available, otherwise show placeholder items */}
            {roadmap.length > 0 ? (
              roadmap.map((item) => (
                <Card key={item.id} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={
                              item.status === 'completed' ? 'border-green-400/30 text-green-400' :
                              item.status === 'in_progress' ? 'border-yellow-400/30 text-yellow-400' :
                              'border-gray-400/30 text-gray-400'
                            }
                          >
                            {item.status === 'in_progress' ? 'In Progress' : 
                             item.status === 'completed' ? 'Completed' : 'Planned'}
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3">{item.description}</p>
                        {item.expected_date && (
                          <p className="text-sm text-gray-500">Expected: {item.expected_date}</p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Placeholder roadmap items when no data is available
              [
                {
                  title: "Paystack Python SDK",
                  description: "Complete integration for Nigeria's leading payment processor",
                  status: "in_progress",
                  expected_date: "Q2 2024"
                },
                {
                  title: "Flutterwave Python SDK", 
                  description: "Pan-African payment gateway integration",
                  status: "planned",
                  expected_date: "Q3 2024"
                },
                {
                  title: "M-Pesa Python SDK",
                  description: "Mobile money integration for East Africa",
                  status: "planned",
                  expected_date: "Q4 2024"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={
                              item.status === 'in_progress' ? 'border-yellow-400/30 text-yellow-400' :
                              'border-gray-400/30 text-gray-400'
                            }
                          >
                            {item.status === 'in_progress' ? 'In Progress' : 'Planned'}
                          </Badge>
                        </div>
                        <p className="text-gray-400 mb-3">{item.description}</p>
                        <p className="text-sm text-gray-500">Expected: {item.expected_date}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12 p-8 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-lg border border-cyan-500/20">
            <h3 className="text-xl font-semibold text-white mb-3">Have an API in mind?</h3>
            <p className="text-gray-400 mb-6">
              We'd love to hear about APIs you'd like us to create SDKs for. Community input shapes our roadmap.
            </p>
            <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
              Request an SDK
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Elusion Labs
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="mailto:hello@elusionlabs.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                hello@elusionlabs.com
              </a>
            </div>
          </div>
          
          <Separator className="my-8 bg-gray-800" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-500 mb-2 md:mb-0">
              © 2024 Elusion Labs. All rights reserved.
            </p>
            <p className="text-gray-500 italic">
              "Making APIs developer-friendly, one SDK at a time"
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
