"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TrendingUp, TrendingDown, FileText, Bookmark, BookmarkCheck, ExternalLink, Download } from 'lucide-react';

interface MarketInsight {
  id: string;
  title: string;
  summary: string;
  category: 'Policy' | 'PriceTrend' | 'TechUpdate' | 'MarketNews';
  trend?: 'up' | 'down' | 'stable';
  percentage?: string;
  timestamp: string;
  source: string;
  isBookmarked: boolean;
  hasFullArticle: boolean;
  hasReport: boolean;
  isRead: boolean;
}

export function MarketInsightsSection() {
  const [filter, setFilter] = useState('All');
  const [frequency, setFrequency] = useState('daily');
  
  const [insights, setInsights] = useState<MarketInsight[]>([
    {
      id: '1',
      title: 'India Introduces New Carbon Trading Rule',
      summary: 'New regulations will affect pricing mechanisms for carbon credits. Enhanced MRV requirements for better transparency.',
      category: 'Policy',
      timestamp: '2 hours ago',
      source: 'Ministry of Environment',
      isBookmarked: false,
      hasFullArticle: true,
      hasReport: true,
      isRead: false
    },
    {
      id: '2',
      title: 'Forestry Credits Trending Higher',
      summary: 'Forestry-based carbon credits are showing strong performance this quarter with increased demand from corporate buyers.',
      category: 'PriceTrend',
      trend: 'up',
      percentage: '22%',
      timestamp: '4 hours ago',
      source: 'Carbon Market Watch',
      isBookmarked: true,
      hasFullArticle: true,
      hasReport: false,
      isRead: false
    },
    {
      id: '3',
      title: 'Verra VCS 2023 Update',
      summary: 'MRV changes explained: New monitoring, reporting, and verification standards will take effect from Q4 2024.',
      category: 'TechUpdate',
      timestamp: '1 day ago',
      source: 'Verra Registry',
      isBookmarked: false,
      hasFullArticle: true,
      hasReport: true,
      isRead: true
    },
    {
      id: '4',
      title: 'Renewable Energy Credits Demand Surge',
      summary: 'Corporate sustainability commitments drive 45% increase in REC purchases across Asian markets.',
      category: 'MarketNews',
      trend: 'up',
      percentage: '45%',
      timestamp: '2 days ago',
      source: 'Clean Energy Institute',
      isBookmarked: false,
      hasFullArticle: true,
      hasReport: false,
      isRead: false
    },
    {
      id: '5',
      title: 'EU CBAM Implementation Timeline',
      summary: 'Carbon Border Adjustment Mechanism will impact export strategies for Indian manufacturers starting 2026.',
      category: 'Policy',
      timestamp: '3 days ago',
      source: 'European Commission',
      isBookmarked: true,
      hasFullArticle: true,
      hasReport: true,
      isRead: true
    }
  ]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Policy':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'PriceTrend':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'TechUpdate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'MarketNews':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredInsights = filter === 'All' 
    ? insights 
    : insights.filter(insight => insight.category === filter);

  const toggleBookmark = (id: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === id ? { ...insight, isBookmarked: !insight.isBookmarked } : insight
    ));
  };

  const markAsRead = (id: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === id ? { ...insight, isRead: true } : insight
    ));
  };

  const unreadCount = insights.filter(insight => !insight.isRead).length;
  const bookmarkedCount = insights.filter(insight => insight.isBookmarked).length;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Policy">#Policy</SelectItem>
              <SelectItem value="PriceTrend">#PriceTrend</SelectItem>
              <SelectItem value="TechUpdate">#TechUpdate</SelectItem>
              <SelectItem value="MarketNews">#MarketNews</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{unreadCount} unread</span>
            <span>•</span>
            <span>{bookmarkedCount} saved</span>
          </div>
        </div>

        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily Updates</SelectItem>
            <SelectItem value="weekly">Weekly Digest</SelectItem>
            <SelectItem value="off">Turn Off</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <Card 
            key={insight.id} 
            className={`hover:shadow-md transition-all cursor-pointer ${
              !insight.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
            }`}
            onClick={() => markAsRead(insight.id)}
          >
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(insight.category)}`}
                      >
                        #{insight.category}
                      </Badge>
                      {insight.trend && (
                        <div className="flex items-center gap-1">
                          {getTrendIcon(insight.trend)}
                          <span className={`text-sm font-medium ${
                            insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {insight.percentage}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className={`font-medium ${!insight.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {insight.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground">
                      {insight.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {insight.source} • {insight.timestamp}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {insight.hasFullArticle && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read Full Article
                          </Button>
                        )}
                        {insight.hasReport && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 ml-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(insight.id);
                    }}
                  >
                    {insight.isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredInsights.length === 0 && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No insights found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === 'All' 
                  ? "No market insights available at the moment." 
                  : `No insights found for ${filter} category.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-medium">12</p>
                <p className="text-xs text-muted-foreground">New insights</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bookmarked</p>
                <p className="text-2xl font-medium">{bookmarkedCount}</p>
                <p className="text-xs text-muted-foreground">Saved insights</p>
              </div>
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Frequency</p>
                <p className="text-2xl font-medium capitalize">{frequency}</p>
                <p className="text-xs text-muted-foreground">Update schedule</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}