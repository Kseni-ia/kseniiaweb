interface PageDotsProps {
  currentSection: number;
  totalSections: number;
}

export function PageDots({ currentSection, totalSections }: PageDotsProps) {
  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => window.fullpage_api?.moveTo(index + 1)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSection === index
              ? 'bg-[#000080] scale-125'
              : 'bg-[#000080]/40 hover:bg-[#000080]/60'
          }`}
          aria-label={`Go to page ${index + 1}`}
        />
      ))}
    </div>
  );
}
