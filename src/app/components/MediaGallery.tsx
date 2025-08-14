import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Image, Video, Map, Satellite, FileText, Camera, Play, Maximize2, Calendar, MapPin, User, Eye, Download, Share2, Fullscreen } from 'lucide-react';
// import { ImageWithFallback } from './figma/ImageWithFallback';

interface MediaGalleryProps {
    media: MediaItem[];
    projectTitle: string;
}

type MediaType = 'image' | 'video' | 'map' | 'satellite' | 'document' | 'drone';

interface MediaItem {
    id: string;
    type: MediaType;
    url: string;
    thumbnail?: string;
    title: string;
    description?: string;
    date?: string;
    location?: string;
    photographer?: string;
    featured?: boolean;
}

export default function MediaGallery({ media, projectTitle }: MediaGalleryProps) {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [activeMediaType, setActiveMediaType] = useState<MediaType | 'all'>('all');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const getMediaIcon = (type: MediaType) => {
        switch (type) {
            case 'image':
                return <Image className="w-4 h-4" />;
            case 'video':
                return <Video className="w-4 h-4" />;
            case 'map':
                return <Map className="w-4 h-4" />;
            case 'satellite':
                return <Satellite className="w-4 h-4" />;
            case 'document':
                return <FileText className="w-4 h-4" />;
            case 'drone':
                return <Camera className="w-4 h-4" />;
            default:
                return <Image className="w-4 h-4" />;
        }
    };

    // console.log(media[0].documents[0].url)

    const getMediaTypeColor = (type: MediaType) => {
        switch (type) {
            case 'image':
                return 'bg-blue-100 text-blue-800';
            case 'video':
                return 'bg-red-100 text-red-800';
            case 'map':
                return 'bg-green-100 text-green-800';
            case 'satellite':
                return 'bg-purple-100 text-purple-800';
            case 'document':
                return 'bg-gray-100 text-gray-800';
            case 'drone':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredMedia = activeMediaType === 'all'
        ? media
        : media.filter(item => item.type === activeMediaType);

    console.log(media)

    const mediaTypes = Array.from(new Set(media.map(item => item.type)));
    const featuredMedia = media.filter(item => item.featured);

    const openLightbox = (mediaItem: MediaItem) => {
        setSelectedMedia(mediaItem);
        setIsLightboxOpen(true);
    };

    const handleMediaAction = (mediaItem: MediaItem, action: 'view' | 'download' | 'share') => {
        console.log(`${action}:`, mediaItem);

        switch (action) {
            case 'view':
                openLightbox(mediaItem);
                break;
            case 'download':
                // Handle download logic
                break;
            case 'share':
                // Handle share logic
                break;
        }
    };

    if (!media || media.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Image className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Media Available</h3>
                <p className="text-gray-600">Media content for this project will be available soon.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Featured Media Section */}
            {featuredMedia.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        Featured Media
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {featuredMedia.slice(0, 2).map((mediaItem) => (
                            <div
                                key={mediaItem.id}
                                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                                onClick={() => openLightbox(mediaItem)}
                            >
                                <div className="aspect-video relative">
                                    {/* <ImageWithFallback
                    src={mediaItem.thumbnail || mediaItem.url}
                    alt={mediaItem.title}
                    className="w-full h-full object-cover"
                  /> */}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={`${getMediaTypeColor(mediaItem.type)} text-xs`}>
                                                    {getMediaIcon(mediaItem.type)}
                                                    <span className="ml-1 capitalize">{mediaItem.type}</span>
                                                </Badge>
                                                {mediaItem.type === 'video' && (
                                                    <Badge className="bg-red-500/80 text-white text-xs">
                                                        <Play className="w-3 h-3 mr-1" />
                                                        Video
                                                    </Badge>
                                                )}
                                            </div>
                                            <h4 className="font-bold mb-1">{mediaItem.title}</h4>
                                            <p className="text-sm opacity-90 line-clamp-2">{mediaItem.description}</p>
                                        </div>
                                    </div>

                                    {/* Play Button for Videos */}
                                    {mediaItem.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Play className="w-8 h-8 text-red-600 ml-1" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Zoom Icon for Interactive Content */}
                                    {(mediaItem.type === 'map' || mediaItem.type === 'satellite') && (
                                        <div className="absolute top-4 right-4">
                                            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                <Maximize2 className="w-5 h-5 text-gray-700" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Media Gallery */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-3 text-gray-900">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Image className="w-5 h-5 text-green-600" />
                        </div>
                        Project Media Gallery
                    </h3>

                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        {media.length} media files
                    </div>
                </div>

                {/* Media Type Filter */}
                <Tabs value={activeMediaType} onValueChange={(value) => setActiveMediaType(value as MediaType | 'all')} className="w-full">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 bg-gray-100 rounded-xl p-1 h-auto mb-6">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium rounded-lg py-2 px-3 text-xs sm:text-sm"
                        >
                            All ({media.length})
                        </TabsTrigger>
                        {mediaTypes.map((type) => (
                            <TabsTrigger
                                key={type}
                                value={type}
                                className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium rounded-lg py-2 px-3 text-xs sm:text-sm"
                            >
                                <span className="hidden sm:inline capitalize">{type} ({media.filter(m => m.type === type).length})</span>
                                <span className="sm:hidden">{getMediaIcon(type)}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value={activeMediaType} className="mt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMedia.map((mediaItem) => (
                                <div
                                    key={mediaItem.id}
                                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                                >
                                    <div className="aspect-video relative cursor-pointer" onClick={() => openLightbox(mediaItem)}>
                                        {/* <ImageWithFallback
                                            src={mediaItem.thumbnail || mediaItem.url}
                                            alt={mediaItem.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            /> */}

                                        {/* Media Type Badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge className={`${getMediaTypeColor(mediaItem.type)} text-xs shadow-lg`}>
                                                {getMediaIcon(mediaItem.type)}
                                                <span className="ml-1 capitalize">{mediaItem.type}</span>
                                            </Badge>
                                        </div>

                                        {/* Play Button for Videos */}
                                        {mediaItem.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="w-6 h-6 text-red-600 ml-1" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                                                <Fullscreen className="w-4 h-4 mr-2" />
                                                View
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">{mediaItem.title}</h4>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{mediaItem.description}</p>

                                        {/* Metadata */}
                                        <div className="space-y-2 mb-4">
                                            {mediaItem.date && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(mediaItem.date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {mediaItem.location && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{mediaItem.location}</span>
                                                </div>
                                            )}
                                            {mediaItem.photographer && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <User className="w-3 h-3" />
                                                    <span>{mediaItem.photographer}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMediaAction(mediaItem, 'view');
                                                }}
                                                className="flex-1 text-xs"
                                            >
                                                <Eye className="w-3 h-3 mr-1" />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMediaAction(mediaItem, 'download');
                                                }}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMediaAction(mediaItem, 'share');
                                                }}
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredMedia.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {getMediaIcon(activeMediaType as MediaType)}
                                </div>
                                <p>No {activeMediaType} content available</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                    {selectedMedia && (
                        <div className="flex flex-col h-full">
                            <DialogHeader className="p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className={`${getMediaTypeColor(selectedMedia.type)} text-sm`}>
                                                {getMediaIcon(selectedMedia.type)}
                                                <span className="ml-2 capitalize">{selectedMedia.type}</span>
                                            </Badge>
                                            {selectedMedia.featured && (
                                                <Badge className="bg-yellow-100 text-yellow-800 text-sm">Featured</Badge>
                                            )}
                                        </div>
                                        <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
                                            {selectedMedia.title}
                                        </DialogTitle>
                                        <p className="text-gray-600">{selectedMedia.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <Button variant="ghost" size="sm" onClick={() => handleMediaAction(selectedMedia, 'download')}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleMediaAction(selectedMedia, 'share')}>
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="flex-1 p-6 overflow-auto">
                                {selectedMedia.type === 'video' ? (
                                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                        <video
                                            controls
                                            className="w-full h-full"
                                            poster={selectedMedia.thumbnail}
                                        >
                                            <source src="https://carbclex.com/{selectedMedia.documents[0].url}" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                ) : selectedMedia.type === 'map' ? (
                                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium">Interactive 3D Map</p>
                                            <p className="text-sm text-gray-500 mt-2">Click to open in full-screen mode</p>
                                            <Button className="mt-4" onClick={() => window.open(selectedMedia.url, '_blank')}>
                                                <Fullscreen className="w-4 h-4 mr-2" />
                                                Open Full Map
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-lg overflow-hidden">
                                                {/* <ImageWithFallback
                            src={selectedMedia.url}
                            alt={selectedMedia.title}
                            className="w-full h-auto max-h-[60vh] object-contain mx-auto bg-gray-50 rounded-lg"
                            /> */}
                                    </div>
                                )}

                                {/* Media Metadata */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                                    {selectedMedia.date && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(selectedMedia.date).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {selectedMedia.location && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{selectedMedia.location}</span>
                                        </div>
                                    )}
                                    {selectedMedia.photographer && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-4 h-4" />
                                            <span>By {selectedMedia.photographer}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}