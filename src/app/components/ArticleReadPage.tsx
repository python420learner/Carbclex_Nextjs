import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  ThumbsUp, 
  MessageCircle,
  ArrowRight,
  Quote
} from 'lucide-react';
import {motion} from 'framer-motion'

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  location: string;
  publishDate: string;
  author: string;
  readTime: string;
  image: string;
  featured?: boolean;
  views: number;
}

interface ArticleReadPageProps {
  article: BlogPost;
  onBack: () => void;
//   relatedArticles: BlogPost[];
//   onArticleClick: (article: BlogPost) => void;
}

// Extended article content generator
const getArticleContent = (article: BlogPost) => {
  const contentLibrary = {
    '1': {
      content: [
        {
          type: 'paragraph',
          text: 'Carbon credits have emerged as one of the most important tools in the global fight against climate change. As governments, corporations, and individuals seek ways to reduce their environmental impact, understanding how carbon credits work has become essential for anyone interested in sustainability and climate action.'
        },
        {
          type: 'heading',
          text: 'What Are Carbon Credits?'
        },
        {
          type: 'paragraph',
          text: 'A carbon credit represents one metric ton of carbon dioxide (CO₂) that has been removed from the atmosphere or prevented from entering it through verified environmental projects. These projects range from reforestation initiatives and renewable energy installations to methane capture facilities and direct air capture technologies.'
        },
        {
          type: 'quote',
          text: 'Carbon credits create a financial incentive for organizations to invest in projects that actively combat climate change while providing a pathway for businesses to achieve their net-zero commitments.',
          author: 'Dr. Sarah Chen, Environmental Scientist'
        },
        {
          type: 'heading',
          text: 'How Carbon Markets Work'
        },
        {
          type: 'paragraph',
          text: 'Carbon markets operate on the principle of supply and demand. Project developers create carbon credits by implementing verified environmental projects that measurably reduce or remove CO₂ from the atmosphere. These credits are then sold to businesses, governments, and individuals who want to offset their carbon emissions.'
        },
        {
          type: 'paragraph',
          text: 'There are two main types of carbon markets: compliance markets and voluntary markets. Compliance markets are created by government regulations that require certain industries to limit their emissions. Voluntary markets, like CarbClex, allow organizations to purchase credits voluntarily to meet their sustainability goals.'
        },
        {
          type: 'heading',
          text: 'Verification and Standards'
        },
        {
          type: 'paragraph',
          text: 'Not all carbon credits are created equal. Reputable carbon credits must meet strict verification standards set by organizations like Verra, Gold Standard, and the Climate Action Reserve. These standards ensure that carbon reduction projects are additional, permanent, verifiable, and avoid double-counting.'
        },
        {
          type: 'list',
          items: [
            'Additionality: The project would not have happened without carbon credit financing',
            'Permanence: Carbon reductions or removals are long-lasting',
            'Verifiability: Third-party verification confirms claimed emission reductions',
            'No double-counting: Each credit is only sold and retired once'
          ]
        },
        {
          type: 'heading',
          text: 'Types of Carbon Offset Projects'
        },
        {
          type: 'paragraph',
          text: 'Carbon offset projects fall into several categories, each with unique benefits and characteristics:'
        },
        {
          type: 'paragraph',
          text: '**Nature-Based Solutions**: These projects harness the power of natural ecosystems to capture and store carbon. Forest conservation projects protect existing forests from deforestation, while reforestation projects plant new trees in previously forested areas. Regenerative agriculture improves soil health and increases carbon storage in farmland.'
        },
        {
          type: 'paragraph',
          text: '**Renewable Energy**: Solar, wind, and hydroelectric projects reduce emissions by displacing fossil fuel-based electricity generation. These projects are particularly important in developing countries where new energy infrastructure is being built.'
        },
        {
          type: 'paragraph',
          text: '**Technology-Based Solutions**: Advanced technologies like direct air capture machines physically remove CO₂ from the atmosphere, while methane capture projects prevent this potent greenhouse gas from escaping into the air.'
        }
      ]
    },
    '2': {
      content: [
        {
          type: 'paragraph',
          text: 'Direct Air Capture (DAC) technology represents one of the most promising frontiers in the fight against climate change. As atmospheric CO₂ levels continue to rise, these revolutionary machines offer a way to literally pull carbon dioxide directly from the air around us, providing a critical tool for achieving global climate goals.'
        },
        {
          type: 'heading',
          text: 'The Science Behind Direct Air Capture'
        },
        {
          type: 'paragraph',
          text: 'DAC facilities use large fans to draw ambient air through specialized filters containing chemicals called sorbents. These sorbents bind with CO₂ molecules, separating them from other gases in the atmosphere. Once captured, the CO₂ can be permanently stored underground or used to create useful products like concrete or synthetic fuels.'
        },
        {
          type: 'quote',
          text: 'Direct air capture is not just a climate solution—it\'s a necessary technology for achieving net-negative emissions and reversing decades of atmospheric carbon accumulation.',
          author: 'Dr. Michael Rodriguez, Climate Technology Expert'
        },
        {
          type: 'heading',
          text: 'Current DAC Facilities Around the World'
        },
        {
          type: 'paragraph',
          text: 'Iceland has become a leader in DAC technology, hosting the world\'s largest operational facility. The country\'s abundant renewable energy and suitable geology for carbon storage make it an ideal location for these energy-intensive operations. Other facilities are being developed in the United States, Canada, and Europe.'
        },
        {
          type: 'paragraph',
          text: 'Current DAC facilities can capture thousands of tons of CO₂ annually, but the technology is rapidly scaling. Major investments from governments and private companies are driving down costs and increasing capacity exponentially.'
        },
        {
          type: 'heading',
          text: 'Challenges and Opportunities'
        },
        {
          type: 'paragraph',
          text: 'The primary challenge facing DAC technology is cost. Current capture costs range from $600-1000 per ton of CO₂, significantly higher than other carbon removal methods. However, technological improvements and economies of scale are driving costs down rapidly.'
        },
        {
          type: 'list',
          items: [
            'Energy requirements: DAC facilities need significant clean energy to operate efficiently',
            'Scale: Current facilities need to increase capacity by orders of magnitude',
            'Cost reduction: Technology improvements are driving down per-ton capture costs',
            'Integration: DAC must work alongside other climate solutions for maximum impact'
          ]
        }
      ]
    },
    // Add more content for other articles...
    default: {
      content: [
        {
          type: 'paragraph',
          text: article.excerpt
        },
        {
          type: 'heading',
          text: 'Understanding the Impact'
        },
        {
          type: 'paragraph',
          text: `This ${article.category.toLowerCase()} initiative represents a significant step forward in addressing climate change through innovative approaches and community engagement. By focusing on ${article.location.toLowerCase()}, this project demonstrates how localized action can contribute to global environmental goals.`
        },
        {
          type: 'paragraph',
          text: 'The project employs cutting-edge methodologies to ensure maximum environmental benefit while supporting local communities and economic development. Through careful planning and execution, initiatives like this create lasting positive change that extends far beyond their immediate environmental impact.'
        },
        {
          type: 'heading',
          text: 'Key Benefits and Outcomes'
        },
        {
          type: 'list',
          items: [
            'Measurable reduction in greenhouse gas emissions',
            'Support for local communities and sustainable development',
            'Implementation of innovative technologies and best practices',
            'Contribution to global climate action and sustainability goals'
          ]
        },
        {
          type: 'paragraph',
          text: 'As we continue to face the challenges of climate change, projects like this provide hope and demonstrate that effective action is possible when we combine scientific knowledge, technological innovation, and community commitment.'
        }
      ]
    }
  };

  return contentLibrary[article.id as keyof typeof contentLibrary] || contentLibrary.default;
};

// Content renderer component
function ContentRenderer({ content }: { content: any[] }) {
  return (
    <div className="prose prose-lg max-w-none">
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={index} className="text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: block.text }} />
            );
          case 'quote':
            return (
              <div key={index} className="bg-green-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
                <div className="flex items-start gap-4">
                  <Quote className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-800 italic text-lg leading-relaxed mb-3">
                      "{block.text}"
                    </p>
                    {block.author && (
                      <p className="text-green-700 font-medium text-sm">
                        — {block.author}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          case 'list':
            return (
              <ul key={index} className="space-y-3 mb-6 ml-6">
                {block.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex} className="text-gray-700 leading-relaxed list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

// Related article card
function RelatedArticleCard({ article, onClick }: { article: BlogPost; onClick: (article: BlogPost) => void }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white cursor-pointer"
        onClick={() => onClick(article)}
      >
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {article.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-600 text-white px-2 py-1 text-xs">
                Featured
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
              {article.category}
            </Badge>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {article.author}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ArticleReadPage({ article, onBack }: ArticleReadPageProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // In a real app, you might show a toast notification here
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const articleContent = getArticleContent(article);

  return (
    <div className="min-h-screen bg-white">
      {/* Article Hero */}
      <section className="relative py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-green-600 text-white px-3 py-1">
                {article.category}
              </Badge>
              {article.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{article.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Article Actions */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 ${isLiked ? 'text-red-600 border-red-200 bg-red-50' : ''}`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {likes}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={`flex items-center gap-2 ${isBookmarked ? 'text-green-600 border-green-200 bg-green-50' : ''}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white"
          >
            <ContentRenderer content={articleContent.content} />
          </motion.div>
        </div>
      </section>

      {/* Article Footer */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleLike}
                className={`flex items-center gap-2 ${isLiked ? 'text-red-600 border-red-200 bg-red-50' : ''}`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {likes} Likes
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Comments
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? 'text-green-600 border-green-200 bg-green-50' : ''}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Author Bio */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{article.author}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Expert in {article.category.toLowerCase()} and sustainable development with over 10 years of experience in climate action and environmental policy. Passionate about creating content that makes complex climate topics accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {/* {relatedArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <p className="text-lg text-gray-600">
                Continue exploring climate solutions and sustainability insights
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.slice(0, 3).map((relatedArticle, index) => (
                <motion.div
                  key={relatedArticle.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <RelatedArticleCard 
                    article={relatedArticle} 
                    onClick={onArticleClick}
                  />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={onBack}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
              >
                View All Articles
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      )} */}
    </div>
  );
}