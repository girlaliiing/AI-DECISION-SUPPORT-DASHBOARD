"use client"

export default function HomePage() {
  return (
    <div className="w-full h-full bg-[#121826] text-white flex px-10 py-10 overflow-auto">
      {/* --- Left/Main Content --- */}
      <div className="flex-1 flex flex-col items-center justify-start text-center mt-10">
        {/* Title Section */}
        <h1 className="text-5xl font-marcellus font-bold mb-6 tracking-wide">
          BARANGAY TUBORAN
        </h1>

        {/* Description */}
        <p className="max-w-6xl text-gray-300 leading-relaxed mb-12">
          Tuboran is a barangay in the municipality of Mawab, Davao de Oro, with a population of
          3,245 based on the 2020 Census, accounting for 8.19% of the municipality’s total population.
          As of the 2015 Census, it had 2,766 household residents in 634 households, averaging 4.36
          members each. The largest age group was 5–9 years old (324 individuals), while those aged
          80 and above comprised the smallest group (26 individuals). The population is predominantly
          of working age (15–64), making up 62.11%, while young dependents (0–14) account for
          33.12% and senior citizens (65+) represent 4.77%, resulting in a total dependency ratio
          of 61 dependents per 100 working-age residents. The barangay has a median age of 24, indicating
          a relatively young population. Tuboran has shown steady growth, increasing from 2,366 residents
          in 1990 to 3,245 in 2020, with a significant annual growth rate of 3.42% from 2015–2020.
        </p>

        {/* Vision Section */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl font-bold mb-4 tracking-wide">VISION</h2>
          <p className="text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4 tracking-wide">MISSION</h2>
          <p className="text-gray-300 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </p>
        </div>
      </div>

      {/* --- Right Side Info Panel --- */}
      <div className="w-80 border-l border-gray-700 pl-8 flex flex-col justify-start mt-10 space-y-6">
        <div>
          <h3 className="text-gray-400 font-poppins uppercase text-sm mb-2">Last login</h3>
          <ul className="space-y-4">
            <li>
              <p className="font-semibold font-poppins">March 05, 2024</p>
              <p className="text-gray-400 text-sm">1:34 PM</p>
            </li>
            <li>
              <p className="font-semibold font-poppins">November 13, 2023</p>
              <p className="text-gray-400 text-sm">2:06 PM</p>
            </li>
            <li>
              <p className="font-semibold font-poppins">April 21, 2023</p>
              <p className="text-gray-400 text-sm">9:45 AM</p>
            </li>
          </ul>
        </div>

        <div className="pt-6 border-t border-gray-700">
          <h3 className="text-gray-400 font-poppins uppercase text-sm mb-2">Total Budget</h3>
          <p className="text-2xl font-poppins font-bold text-white">PHP 3,450,387.00</p>
        </div>
      </div>
    </div>
  )
}
