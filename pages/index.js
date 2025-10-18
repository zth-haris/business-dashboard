import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, MousePointer, Mail, RefreshCw, Target, Eye, ShoppingCart } from 'lucide-react';

// DEMO DATA - Replace this URL with your Make.com JSON file URL
const DATA_URL = 'REPLACE_WITH_YOUR_JSON_URL';

const demoData = {
  ltv: 487.50,
  totalRevenue: 45780,
  totalCustomers: 234,
  leadsCapture: 1847,
  cac: 42.30,
  cacLtvRatio: 11.5,
  grossProfit: 38940,
  mrr: 12450,
  aov: 195.60,
  churnRate: 8.2,
  revenueBySource: [
    { source: 'ZTH Shorts YT', revenue: 12450, leads: 456, purchases: 67 },
    { source: 'ZTH Training YT', revenue: 8920, leads: 234, purchases: 48 },
    { source: 'ZTH Training IG', revenue: 7650, leads: 389, purchases: 41 },
    { source: 'Player Accelerator IG', revenue: 6540, leads: 298, purchases: 35 },
    { source: 'ZTH Training TT', revenue: 5430, leads: 267, purchases: 29 },
    { source: 'Player Accelerator TT', revenue: 2890, leads: 178, purchases: 15 },
    { source: 'ZTH Motivate IG', revenue: 1450, leads: 145, purchases: 8 },
    { source: 'ZTH Motivate TT', revenue: 450, leads: 89, purchases: 3 }
  ],
  ltvBySource: [
    { source: 'ZTH Shorts YT', ltv: 565 },
    { source: 'ZTH Training YT', ltv: 512 },
    { source: 'ZTH Training IG', ltv: 478 },
    { source: 'Player Accelerator IG', ltv: 445 },
    { source: 'ZTH Training TT', ltv: 423 },
    { source: 'Player Accelerator TT', ltv: 389 },
    { source: 'ZTH Motivate IG', ltv: 367 },
    { source: 'ZTH Motivate TT', ltv: 334 }
  ],
  funnelData: [
    { stage: 'Page Views', count: 12450, rate: 100 },
    { stage: 'Opt-ins', count: 1847, rate: 14.8 },
    { stage: 'VSL Views', count: 1234, rate: 66.8 },
    { stage: 'Checkout', count: 567, rate: 45.9 },
    { stage: 'Purchased', count: 234, rate: 41.3 }
  ],
  refundDays: [
    { day: '7 days', count: 3 },
    { day: '14 days', count: 8 },
    { day: '21 days', count: 12 },
    { day: '30 days', count: 6 },
    { day: '60+ days', count: 4 }
  ],
  churnDays: [
    { day: '7 days', count: 2 },
    { day: '14 days', count: 5 },
    { day: '21 days', count: 9 },
    { day: '30 days', count: 11 },
    { day: '60+ days', count: 7 }
  ],
  regionData: [
    { country: 'United States', purchases: 134, percentage: 57.3 },
    { country: 'Canada', purchases: 42, percentage: 17.9 },
    { country: 'United Kingdom', purchases: 28, percentage: 12.0 },
    { country: 'Australia', purchases: 18, percentage: 7.7 },
    { country: 'Other', purchases: 12, percentage: 5.1 }
  ],
  ageData: [
    { age: '18-24', count: 45 },
    { age: '25-34', count: 98 },
    { age: '35-44', count: 67 },
    { age: '45-54', count: 18 },
    { age: '55+', count: 6 }
  ],
  mrrBreakdown: [
    { product: 'Player Accelerator Payments', amount: 6780, percentage: 54.5 },
    { product: 'Upsell Revenue', amount: 5670, percentage: 45.5 }
  ],
  emailListSize: 8945,
  emailGrowthRate: 12.4,
  totalEmailSales: 8760,
  paymentPlanTakeRate: 68.5,
  upsellTakeRate: 34.2,
  refundsProcessed: 33,
  refundAmount: 6840,
  avgVslWatchTime: '8:34',
  vslCompletionRate: 42.3,
  manychatTriggers: 1245,
  topYoutubeVideos: [
    { title: 'How to Train Like a Pro', views: 45600, conversions: 89 },
    { title: '5 Drills That Changed My Game', views: 38900, conversions: 67 },
    { title: 'The Mental Game', views: 29800, conversions: 54 }
  ],
  storyViews: {
    instagram: 12400,
    tiktok: 8900,
    facebook: 3400
  }
};

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
      )}
    </div>
    {trend && (
      <div className="flex items-center mt-4">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
        )}
        <span className={`text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trendValue}
        </span>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(demoData);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch real data from Make.com
  useEffect(() => {
    const fetchData = async () => {
      if (DATA_URL === 'REPLACE_WITH_YOUR_JSON_URL') {
        return; // Using demo data
      }
      
      setLoading(true);
      try {
        const response = await fetch(DATA_URL);
        const realData = await response.json();
        setData(realData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
    // Refresh every 30 minutes
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6', '#f97316'];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Business Dashboard</h1>
              <p className="text-gray-400">Real-time insights into your business performance</p>
              {DATA_URL === 'REPLACE_WITH_YOUR_JSON_URL' ? (
                <p className="text-xs text-yellow-600 mt-2">⚡ Using demo data - Update DATA_URL in code to connect real data</p>
              ) : (
                <p className="text-xs text-green-600 mt-2">✅ Connected to live data • Last updated: {lastUpdated.toLocaleTimeString()}</p>
              )}
            </div>
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'revenue', 'funnel', 'traffic', 'retention'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="Lifetime Value (LTV)" value={`$${data.ltv}`} icon={DollarSign} trend="up" trendValue="+8.2%" />
              <MetricCard title="Total Revenue" value={`$${data.totalRevenue.toLocaleString()}`} icon={TrendingUp} trend="up" trendValue="+12.4%" />
              <MetricCard title="Total Customers" value={data.totalCustomers} icon={Users} subtitle={`${data.leadsCapture} leads captured`} />
              <MetricCard title="CAC:LTV Ratio" value={`1:${data.cacLtvRatio}`} icon={Target} subtitle={`CAC: $${data.cac}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard title="MRR" value={`$${data.mrr.toLocaleString()}`} subtitle="Monthly Recurring Revenue" />
              <MetricCard title="AOV" value={`$${data.aov}`} subtitle="Average Order Value" />
              <MetricCard title="Gross Profit" value={`$${data.grossProfit.toLocaleString()}`} subtitle="After refunds" />
              <MetricCard title="Churn Rate" value={`${data.churnRate}%`} trend="down" trendValue="-2.1%" />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">LTV by Traffic Source</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.ltvBySource}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="source" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="ltv" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Email List Size" value={data.emailListSize.toLocaleString()} icon={Mail} trend="up" trendValue={`+${data.emailGrowthRate}%`} />
              <MetricCard title="Email Sales" value={`$${data.totalEmailSales.toLocaleString()}`} subtitle="Total revenue from email" />
              <MetricCard title="ManyChat Triggers" value={data.manychatTriggers.toLocaleString()} subtitle="Total automations triggered" />
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Revenue by Traffic Source</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.revenueBySource}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="source" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                  <Bar dataKey="purchases" fill="#8b5cf6" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">MRR Breakdown by Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={data.mrrBreakdown} cx="50%" cy="50%" labelLine={false} label={({ product, percentage }) => `${product}: ${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="amount">
                      {data.mrrBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {data.mrrBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-gray-300">{item.product}</span>
                      </div>
                      <span className="font-semibold">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Purchases by Region</h3>
              <div className="space-y-3">
                {data.regionData.map((region, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{region.country}</span>
                      <span className="text-gray-400">{region.purchases} purchases ({region.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${region.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard title="Payment Plan Take Rate" value={`${data.paymentPlanTakeRate}%`} subtitle="Customers choosing payment plans" />
              <MetricCard title="Upsell Take Rate" value={`${data.upsellTakeRate}%`} subtitle="Customers accepting upsells" />
            </div>
          </div>
        )}

        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Conversion Funnel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="stage" type="category" stroke="#9ca3af" width={120} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="count" fill="#3b82f6">
                    {data.funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {data.funnelData.map((stage, index) => (
                  index > 0 && (
                    <div key={index} className="flex justify-between text-sm text-gray-400">
                      <span>{data.funnelData[index-1].stage} → {stage.stage}</span>
                      <span className="font-semibold text-blue-400">{stage.rate}% conversion</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="Avg VSL Watch Time" value={data.avgVslWatchTime} icon={Eye} subtitle="Out of total length" />
              <MetricCard title="VSL Completion Rate" value={`${data.vslCompletionRate}%`} subtitle="Viewers who finish" />
              <MetricCard title="VSL to Checkout" value={`${data.funnelData[3].rate}%`} subtitle="VSL viewers who checkout" />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Customer Age Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.ageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="age" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'traffic' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Traffic Source Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-3 text-gray-400 font-medium">Source</th>
                      <th className="pb-3 text-gray-400 font-medium">Leads</th>
                      <th className="pb-3 text-gray-400 font-medium">Purchases</th>
                      <th className="pb-3 text-gray-400 font-medium">Revenue</th>
                      <th className="pb-3 text-gray-400 font-medium">Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.revenueBySource.map((source, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3 text-white">{source.source}</td>
                        <td className="py-3 text-gray-300">{source.leads}</td>
                        <td className="py-3 text-gray-300">{source.purchases}</td>
                        <td className="py-3 text-green-400 font-semibold">${source.revenue.toLocaleString()}</td>
                        <td className="py-3 text-blue-400">{((source.purchases / source.leads) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Top Converting YouTube Videos</h3>
              <div className="space-y-4">
                {data.topYoutubeVideos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">{video.title}</h4>
                      <p className="text-sm text-gray-400">{video.views.toLocaleString()} views</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{video.conversions} conversions</p>
                      <p className="text-xs text-gray-500">{((video.conversions / video.views) * 100).toFixed(2)}% CVR</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Story Views Across Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg p-6">
                  <p className="text-white text-sm font-medium mb-2">Instagram</p>
                  <p className="text-3xl font-bold text-white">{data.storyViews.instagram.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-6">
                  <p className="text-white text-sm font-medium mb-2">TikTok</p>
                  <p className="text-3xl font-bold text-white">{data.storyViews.tiktok.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-6">
                  <p className="text-white text-sm font-medium mb-2">Facebook</p>
                  <p className="text-3xl font-bold text-white">{data.storyViews.facebook.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'retention' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard title="Refunds Processed" value={data.refundsProcessed} icon={RefreshCw} subtitle={`$${data.refundAmount.toLocaleString()} total`} />
              <MetricCard title="Churn Rate" value={`${data.churnRate}%`} subtitle="Monthly churn percentage" />
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">When Do Customers Request Refunds?</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.refundDays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="count" fill="#ef4444" name="Refund Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">When Do Customers Churn?</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.churnDays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="count" fill="#f59e0b" name="Churn Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">💡 Key Retention Insights</h3>
              <div className="space-y-3 text-gray-300">
                <p>• Peak refund period: 21 days (consider improving onboarding)</p>
                <p>• Peak churn period: 30 days (critical engagement window)</p>
                <p>• {data.churnRate}% monthly churn = {(100 - data.churnRate).toFixed(1)}% retention rate</p>
                <p>• Implement re-engagement campaigns at day 14 & 28</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
