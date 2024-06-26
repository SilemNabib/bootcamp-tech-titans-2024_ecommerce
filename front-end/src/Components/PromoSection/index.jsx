import { images } from '../../config/PromoSectionData';

/**
 * Component for displaying a promotional section with images and text.
 *
 * @returns {JSX.Element} The rendered PromoSection component.
 */
export default function PromoSection() {
  const columns = [
    images.slice(0, 2),
    images.slice(2, 5),
    images.slice(5, 7)
  ];

  return (
    <div className="relative overflow-hidden bg-white w-full h-full">
      <div className="">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className='flex flex-wrap justify-around items-center'>
            <div className="sm:max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                Unleash Your Summer Spirit!
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Embrace the warmth and vibrancy of the season with our latest summer collection. Let's celebrate life, sunshine, and good times!
              </p>
            </div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div aria-hidden="true" className="pointer-events-none lg:relative lg:inset-y-0 lg:w-full lg:max-w-7xl">
                <div className="">
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    {columns.map((column, colIndex) => (
                      <div key={colIndex} className="grid flex-shrink-0 grid-cols-1 gap-y-4 lg:gap-y-6">
                        {column.map((image, imgIndex) => (
                          <div key={imgIndex} className="h-32 w-24 sm:h-64 sm:w-44 overflow-hidden rounded-lg">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 mb-6 sm:mt-10 flex justify-center">
            <a
              href="#"
              className="inline-block rounded-md border border-transparent bg-black px-6 py-2 text-center text-sm sm:text-base font-medium text-white hover:bg-gray-700"
            >
              Shop Collection
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
