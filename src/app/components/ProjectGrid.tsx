import { useState } from 'react';
// import { ProjectData } from '../types/marketplace';
import ProjectCard from './ProjectCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, SortAsc, Grid3X3, List, Filter, ChevronDown, ChevronUp } from 'lucide-react';

// interface ProjectGridProps {
//   projects: ProjectData[];
//   onProjectClick: (project: ProjectData) => void;
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   sortBy: 'price' | 'impact' | 'latest';
//   onSortChange: (sort: 'price' | 'impact' | 'latest') => void;
// }

export default function ProjectGrid({ 
  projects, 
  onProjectClick,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    const category = project.projectType;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {});

  const categoryTitles = {
    Renewable: 'Renewable Energy Projects',
    Reforestation: 'Methane Capture & Utilization',
    Agriculture: 'Sustainable Agriculture & Soil',
    Carbon_capture: 'Direct Air Capture Technology',
    Energy_efficiency: 'Energy Efficiency & Smart Solutions'
  };

  // const featuredProjects = projects.filter(p => p.featured);
  const featuredProjects = projects;

  return (
    <section id="projects-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Verified Carbon Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse our curated collection of verified carbon offset projects. 
            Each project is independently audited and monitored for real impact.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search projects by name, location, or type..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-48 bg-gray-50 border-0 rounded-xl">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest Projects</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                  <SelectItem value="impact">Highest Impact</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-600 text-white shadow-sm hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-600'}`}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg ${viewMode === 'list' ? 'bg-green-600 text-white shadow-sm hover:bg-green-700' : 'hover:bg-green-50 hover:text-green-600'}`}
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold">{projects.length}</span> project{projects.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <div className="text-sm text-gray-500">
              Showing verified projects only
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Featured Projects</h3>
              <div className="h-0.5 bg-gradient-to-r from-green-500 to-transparent flex-1"></div>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Editor's Choice
              </div>
            </div>
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {featuredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick(project)}
                  viewMode={viewMode}
                  featured
                />
              ))}
            </div>
          </div>
        )}

        {/* Projects by Category */}
        <div className="space-y-16">
          {Object.entries(groupedProjects).map(([category, categoryProjects]) => (
            <ProjectSection
              key={category}
              title={categoryTitles[category as keyof typeof categoryTitles] || category}
              projects={categoryProjects}
              onProjectClick={onProjectClick}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* No Results */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No projects found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or browse different categories to find the perfect project for your climate goals.
            </p>
            <Button 
              onClick={() => onSearchChange('')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// interface ProjectSectionProps {
//   title: string;
//   projects: ProjectData[];
//   onProjectClick: (project: ProjectData) => void;
//   viewMode: 'grid' | 'list';
// }

function ProjectSection({ title, projects, onProjectClick, viewMode }) {
  const [expanded, setExpanded] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const displayProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        </div>
        <Button
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {expanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {/* Projects Grid */}
      {expanded && (
        <>
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {displayProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => onProjectClick(project)}
                viewMode={viewMode} featured={undefined}              />
            ))}
          </div>

          {/* Show More Button */}
          {projects.length > 6 && (
            <div className="text-center pt-4">
              <Button
                onClick={() => setShowAll(!showAll)}
                variant="outline"
                className="px-8 py-3 rounded-xl"
              >
                {showAll ? 'Show Less' : `View All ${projects.length} Projects`}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}