import { Link } from "react-router-dom";

function HospitalCard({ hospital }) {
  return (
    <Link to={`/hospital/${hospital.id}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition cursor-pointer">

        <div className="flex justify-between">

          <div>
            <h2 className="text-2xl font-bold text-blue-700">
              {hospital.name}
            </h2>

            <p className="text-gray-600 mt-2">
              📍 {hospital.city}
            </p>

            <p className="text-gray-600">
              🏥 {hospital.specialty}
            </p>
          </div>

          <div className="text-right">
            <p className="text-yellow-500 font-semibold">
              ⭐ {hospital.rating}
            </p>

            <p className="text-green-600 font-bold mt-2">
              ₹{hospital.avgCost}
            </p>
          </div>

        </div>

      </div>
    </Link>
  );
}

export default HospitalCard;