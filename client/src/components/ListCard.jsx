export default function ListCard({ card }) {
  return (
    <a href={"/recipes/" + card.id}>
      <div className="rounded-xl bg-slate-200 p-4 flex flex-col items-center">
        <img
          src={card.imageURL || "/recipe-placeholder.jpg"}
          className="h-44 aspect-square rounded-xl m-auto drop-shadow-lg"
          alt=""
        />

        <h2 className="font-semibold my-2">{card.title}</h2>
        <span
          className={
            "block rounded-3xl text-xs p-2 px-4 bg-" +
            (card.metadata.type === "vegetarian" ? "green" : "red") +
            "-500"
          }
        >
          {card.metadata.type}
        </span>
        <div className="flex flex-row text-sm my-2">
          <svg
            class="w-4 h-4 text-yellow-300 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>{" "}
          {card.rating || 0} ({card.reviews.length} ratings)
        </div>

        <div className="flex border-t-slate-500 w-full justify-between">
          <div className="">
            <p className="text-xs text-gray-600">Time</p>
            <p>{card.metadata.time} mins</p>
          </div>
          <div className="">
            <p className="text-xs text-gray-600">Difficulty</p>
            <p>{card.metadata.difficulty}</p>
          </div>
        </div>
      </div>
    </a>
  );
}
