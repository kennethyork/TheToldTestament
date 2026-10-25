// Add one entry per video, newest first.
// Once a video is published on YouTube, paste its ID into `youtubeId`.
// The ID is the part after "watch?v=" — e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ → "dQw4w9WgXcQ".
// Videos with an empty youtubeId show as "Coming soon".
const VIDEOS = [
  {
    youtubeId: "",
    title: "Genesis 2: The Seventh Day, the Garden of Eden, and Adam and Eve",
    thumbnail: "assets/genesis-2.jpg",
    description:
      "In Genesis 2, God rests on the seventh day, forms man from the dust of the ground and plants a garden eastward in Eden. This video covers the river that waters the garden, the command about the tree of the knowledge of good and evil, and how the woman was made from Adam's rib. The text is the King James Version, modernized.",
    chapters: [
      ["0:00", "The Seventh Day and the Dust"],
      ["1:22", "A Garden Eastward in Eden"],
      ["2:33", "Bone of My Bones"],
    ],
  },
  {
    youtubeId: "",
    title: "Genesis 1: The Six Days of Creation",
    thumbnail: "assets/genesis-1.jpg",
    description:
      "\"In the beginning God created the heaven and the earth.\" This video goes through Genesis 1 one day at a time, from the first light to the creation of man in God's image. On each of the six days God speaks, and He sees that what He made is good.",
    chapters: [
      ["0:00", "In the Beginning"],
      ["1:21", "Days Two Through Five"],
      ["2:48", "The Sixth Day: Very Good"],
    ],
  },
];
