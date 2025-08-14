
import {
    TreePine,
    Zap,
    Users,
    Lightbulb,
    Factory,
    Wheat,
    Wind,
    Grid3X3
} from 'lucide-react';
import { Button } from './ui/button';

type CategoryType = 'all' | 'Renewable' | 'Energy_efficiency' | 'Agriculture' | 'Carbon_capture' | 'Reforestation';

export default function CategoryFilter({ selectedCategory, onCategoryChange, projects }) {

    const categories = [
        {
            id: 'all' as CategoryType,
            label: 'All Projects',
            icon: Grid3X3,
            description: 'View all available carbon offset projects',
            color: 'bg-slate-500',
            count: projects.length
        },
        {
            id: 'Reforestation' as CategoryType,
            label: 'Reforestation',
            icon: TreePine,
            description: 'Forest conservation and reforestation projects',
            color: 'bg-green-500',
            count: projects.filter(p=>p.projectType==='Reforestation').length
        },
        {
            id: 'Renewable' as CategoryType,
            label: 'Renewable Energy',
            icon: Zap,
            description: 'Solar, wind, and clean energy generation',
            color: 'bg-yellow-500',
            count: projects.filter(p=>p.projectType==='Renewable').length
        },
        {
            id: 'Energy_efficiency' as CategoryType,
            label: 'Energy Efficiency',
            icon: Lightbulb,
            description: 'Building efficiency and smart solutions',
            color: 'bg-blue-500',
            count: projects.filter(p=>p.projectType==='Energy_efficiency').length
        },
        {
            id: 'Agriculture' as CategoryType,
            label: 'Agriculture',
            icon: Wheat,
            description: 'Regenerative farming and soil carbon',
            color: 'bg-emerald-500',
            count:  projects.filter(p=>p.projectType==='Agriculture').length
        },
        {
            id: 'Carbon_capture' as CategoryType,
            label: 'Carbon Capture',
            icon: Wind,
            description: 'Direct air capture and storage',
            color: 'bg-indigo-500',
            count:  projects.filter(p=>p.projectType==='Carbon_capture').length
        }
    ];


    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse by Project Type
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose from verified carbon offset projects across different sectors.
                        Each category represents real, measurable climate impact.
                    </p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        const isSelected = selectedCategory === category.id;

                        return (
                            <Button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                variant="outline"
                                className={`
                group relative h-auto p-4 flex flex-col items-center gap-3 rounded-xl border-2 transition-all duration-200 hover:scale-105
                ${isSelected
                                        ? 'border-green-500 bg-green-50 shadow-lg'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                                    }
                `}
                            >
                                {/* Icon */}
                                <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                ${isSelected
                                        ? `${category.color} text-white`
                                        : `bg-gray-100 text-gray-600 group-hover:${category.color} group-hover:text-white`
                                    }
                `}>
                                    <IconComponent className="w-6 h-6" />
                                </div>

                                {/* Label */}
                                <div className="text-center">
                                    <p className={`font-medium text-sm leading-tight ${isSelected ? 'text-green-700' : 'text-gray-700'
                                        }`}>
                                        {category.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {category.count} projects
                                    </p>
                                </div>

                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                )}

                                {/* Tooltip on hover */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {category.description}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </Button>
                        );
                    })}
                </div>

                {/* Active Filter Display */}
                {selectedCategory !== 'all' && (
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-full px-6 py-3">
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const selectedCat = categories.find(c => c.id === selectedCategory);
                                    if (selectedCat) {
                                        const IconComponent = selectedCat.icon;
                                        return (
                                            <>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedCat.color} text-white`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-green-800">
                                                    Showing {selectedCat.label} Projects ({selectedCat.count})
                                                </span>
                                            </>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                            <Button
                                onClick={() => onCategoryChange('all')}
                                variant="ghost"
                                size="sm"
                                className="text-green-700 hover:text-green-800 h-auto p-1"
                            >
                                ✕
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}