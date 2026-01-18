import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Edit3, ArrowRight, MapPin } from "lucide-react";

const staticArchiveData = [
  {
    url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600",
    title: "The Great Hall",
    location: "Level 1, North Wing",
  },
  {
    url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1600",
    title: "The Silent Archive",
    location: "Basement Floor",
  },
  {
    url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1600",
    title: "Curator's Workspace",
    location: "Level 4, East Wing",
  },
];

const LibraryCarousel = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <section className="mx-auto max-w-[1300px] px-4 sm:px-10 py-8">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6 border-l-4 border-amber-600 pl-4 sm:pl-6">
        <div>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-amber-600 mb-0.5">
            Environment
          </p>
          <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-900 leading-none">
            EXPLORE ARCHIVE<span className="text-amber-500">.</span>
          </h2>
        </div>

        {user?.role === "ADMIN" && (
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex rounded-full border-zinc-200 text-[11px] font-bold text-zinc-600 hover:text-amber-600 transition-all gap-2"
          >
            <Edit3 size={12} />
            Edit
          </Button>
        )}
      </div>

      {/* Responsive Carousel Container */}
      <div className="relative group overflow-hidden">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {staticArchiveData.map((item, index) => (
              <CarouselItem key={index}>
                {/* Dimension Tweaks: 
                  - Mobile: aspect-[4/3] (Taller for readability)
                  - Desktop: aspect-[21/9] (Wide & professional)
                  - max-h-[450px] to prevent it from taking the whole screen
                */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] aspect-[4/3] md:aspect-[21/9] lg:max-h-[450px] group/item">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover/item:scale-105"
                  />
                  
                  {/* Adaptive Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent" />

                  {/* Content Overlay - Scales based on Screen */}
                  <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white right-6">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2 text-amber-400">
                      <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" />
                      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">
                        {item.location}
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-black tracking-tighter mb-3 sm:mb-4">
                      {item.title}
                    </h3>
                    <button className="flex items-center gap-2 px-4 py-1.5 sm:px-6 sm:py-2 rounded-full bg-white text-zinc-900 text-[10px] sm:text-xs font-bold hover:bg-amber-600 hover:text-white transition-all active:scale-95 shadow-lg">
                      View Details <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation - Hidden on mobile, subtle on desktop */}
          <div className="absolute right-6 bottom-6 hidden sm:flex gap-2 z-20">
        <CarouselPrevious 
             className="static h-10 w-10 rounded-full bg-white border border-zinc-200 text-zinc-900 shadow-lg translate-y-0 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 opacity-0 group-hover:opacity-100" 
          />
      <CarouselNext 
         className="static h-10 w-10 rounded-full bg-white border border-zinc-200 text-zinc-900 shadow-lg translate-y-0 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300 opacity-0 group-hover:opacity-100" 
         />
       </div>
        </Carousel>
      </div>
    </section>
  );
};

export default LibraryCarousel;