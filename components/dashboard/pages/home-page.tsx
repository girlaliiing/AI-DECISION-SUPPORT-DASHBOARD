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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
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
