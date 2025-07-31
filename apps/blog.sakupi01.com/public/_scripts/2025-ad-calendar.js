class AdventCalendar2025 extends HTMLElement {
  constructor() {
    super();
    this.adventData = [];
  }

  async connectedCallback() {
    try {
      // Mock data for testing - day0 is fetched
      const mockPosts = [
        {
          title:
            "🎨 CSS Advent Calendar: Day 0 / Introduction to CSS Evolution",
          pubDate: "2025-07-31",
          description:
            "A journey through CSS from its inception to modern techniques",
          link: "/dev/articles/2025-css-advent-0",
          content: "...",
          tags: ["css", "advent-calendar", "web-development"],
        },
      ];

      // Process the data
      this.adventData = this.processAdventData(mockPosts);

      // Render the calendar
      this.render();
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      this.adventData = Array.from({ length: 26 }, (_, i) => ({
        day: i,
        date: new Date(2025, 6, 31 + i),
        title: `Day ${i}`,
        description: "Coming soon",
        link: "",
        isWritten: false,
        tags: [],
      }));
      this.render();
    }
  }

  processAdventData(posts) {
    // Create a map of day numbers to blog posts
    const postMap = new Map();
    const cssAdventPosts = posts
      .filter((post) => post.link.includes("/dev/articles/2025-css-advent-"))
      .sort((a, b) => {
        // Extract day number from link
        const aMatch = a.link.match(/2025-css-advent-(\d+)/);
        const bMatch = b.link.match(/2025-css-advent-(\d+)/);
        const aNum = aMatch ? Number.parseInt(aMatch[1]) : 0;
        const bNum = bMatch ? Number.parseInt(bMatch[1]) : 0;
        return aNum - bNum;
      });

    for (const post of cssAdventPosts) {
      const match = post.link.match(/2025-css-advent-(\d+)/);
      if (match) {
        const dayNumber = Number.parseInt(match[1]);
        postMap.set(dayNumber, post);
      }
    }

    // Create advent data array
    const adventData = Array.from({ length: 26 }, (_, i) => {
      const dayNumber = i;
      const blogPost = postMap.get(dayNumber);

      const cleanTitle = (title) => {
        return title.replace(/^🎨 CSS Advent Calendar: Day \d+ \/ /, "");
      };

      return {
        day: i,
        date: new Date(2025, 6, 31 + i),
        title: blogPost ? cleanTitle(blogPost.title) : `Day ${i}`,
        description: blogPost ? blogPost.description : "Coming soon",
        link: blogPost ? blogPost.link : "",
        isWritten: !!blogPost,
        tags: blogPost ? blogPost.tags : [],
      };
    });

    return adventData;
  }

  createCalendarGrid() {
    const startDay = new Date(2025, 6, 31); // July 31
    const startDayOfWeek = (startDay.getDay() + 6) % 7; // Thursday = 3

    // Create calendar grid: 7 columns x 5 rows
    const calendarGrid = Array(5)
      .fill(null)
      .map(() => Array(7).fill(null));

    // Fill in the advent days (0-25)
    for (let i = 0; i < 26; i++) {
      const currentDate = new Date(2025, 6, 31 + i);
      const dayOfWeek = (currentDate.getDay() + 6) % 7;
      const weekOffset = Math.floor((startDayOfWeek + i) / 7);

      if (weekOffset < 5) {
        calendarGrid[weekOffset][dayOfWeek] = this.adventData[i];
      }
    }

    return calendarGrid;
  }

  render() {
    const calendarGrid = this.createCalendarGrid();
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Add styles to the document if not already present
    if (!document.getElementById("advent-calendar-2025-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "advent-calendar-2025-styles";
      styleElement.textContent = `
        advent-calendar-2025 {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
        }

        /* Table-based calendar */
        .calendar-table {
          container-name: calendarTable;
          container-type: inline-size;
          width: 100%;
          border-collapse: separate;
          border-spacing: 2px;
          background: var(--link-border);
          border-radius: 4px;
          overflow: hidden;
          margin: 0;
        }

        /* Weekday headers */
        .weekday-header {
          background: var(--card-bg-hover);
          padding: 0.75rem 0.5rem;
          text-align: center;
          font-weight: 600;
          color: var(--color-text);
          font-size: 0.9rem;
          border: none;
          position: relative;
        }

        /* Calendar cells */
        .calendar-cell {
          background: var(--card-bg);
          width: 14.28%; /* 100% / 7 days */
          padding: 0;
          border: none;
          position: relative;
          vertical-align: top;
        }

        .calendar-cell.empty {
          background: light-dark(
            color-mix(in oklch, var(--card-bg), transparent 50%),
            color-mix(in oklch, var(--card-bg), transparent 50%)
          );
          opacity: 0.3;
        }

        .calendar-cell.written {
          background: light-dark(
            color-mix(in oklch, var(--color-primary-medium), white 95%),
            color-mix(in oklch, var(--color-primary-medium), black 90%)
          );
          .day-content {
            transition: all 0.2s ease;
            cursor: pointer;
          }
        }

        .calendar-cell.unwritten {
          opacity: 0.6;
        }

        /* Day content wrapper with grid */
        .day-content {
          display: grid;
          grid-template-rows: auto 1fr auto;
          box-sizing: border-box;
          padding: 0.75rem 0.75rem 0 0.75rem;
        }

        .calendar-cell.written:hover .day-content {
          background: var(--card-bg-hover);
          transform: scale(1.02);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }

        .calendar-cell.written:hover .day-content {
          background: light-dark(
            color-mix(in oklch, var(--color-primary-medium), white 90%),
            color-mix(in oklch, var(--color-primary-medium), black 85%)
          );
        }

        .empty-cell {
          height: 100%;
        }

        .main-link {
          grid-row: 1 / 3;
          grid-column: 1;
          display: grid;
          grid-template-rows: subgrid;
          text-decoration: none;
          border: none;
          transition: all 0.2s ease;
          color: inherit;
        }

        /* Day header with number and status */
        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          grid-row: 1;
          grid-column: 1;
        }

        .main-link .day-header {
          padding: 0;
        }

        .day-number {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary-medium);
        }

        .day-status {
          font-size: 1rem;
          font-weight: 700;
        }

        .calendar-cell.written .day-status {
          color: var(--color-primary-medium);
        }

        .calendar-cell.unwritten .day-status {
          color: var(--color-text);
          opacity: 0.4;
        }

        /* Day info */
        .day-info {
          display: flex;
          flex-direction: column;
          grid-row: 2;
          grid-column: 1;
          flex: 1;
        }

        .main-link .day-info {
          padding: 0;
        }

        .day-title {
          font-size: 1rem;
          color: var(--color-text);
          margin-bottom: 0.4rem;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }

        .day-description {
          font-size: 0.75rem;
          color: var(--color-text);
          opacity: 0.7;
          line-height: 1.3;
          margin-bottom: 0.5rem;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .day-content:focus-within {
          outline: 2px solid var(--focusable);
          outline-offset: 2px;
        }

        @media (max-width: 650px) {
          .day-description, .day-status, .day-title {
            display: none;
          }

          .day-info[data-status="written"]::after {
            content: "🎨" / "Written";
            display: grid;
            place-content: center;
            margin-left: 0.2rem;
            font-size: 5cqw;

          }
          
          .calendar-header {
            margin-bottom: 1rem;
          }

          .calendar-title {
            font-size: 1.1rem;
          }

          .calendar-subtitle {
            font-size: 0.9rem;
          }

          .calendar-cell {
            height: 100px;
          }

          .day-content {
            padding: 0.4rem;
          }

          .day-number {
            font-size: 1rem;
          }
          
          .weekday-header {
            padding: 0.4rem 0.2rem;
            font-size: 0.7rem;
          }

        }

        /* Progressive enhancement for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .day-content {
            transition: none;
          }

          .calendar-cell:hover .day-content {
            transform: none;
          }

          .day-link:hover {
            transform: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .calendar-table {
            border: 2px solid;
          }

          .calendar-cell.written {
            background: highlight;
            color: highlighttext;
          }
        }

        /* Print styles */
        @media print {
          .calendar-table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          .calendar-cell {
            border: 1px solid #000;
          }

          .day-content:hover {
            transform: none;
            box-shadow: none;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Render the calendar content
    this.innerHTML = `
      <table class="calendar-table">
        <!-- Weekday headers -->
        <thead>
          <tr>
            ${weekdays.map((day) => `<th class="weekday-header">${day}</th>`).join("")}
          </tr>
        </thead>
        
        <!-- Calendar body -->
        <tbody>
          ${calendarGrid
            .map(
              (week) => `
            <tr class="calendar-week">
              ${week
                .map(
                  (cell) => `
                <td class="${cell ? (cell.isWritten ? "calendar-cell written" : "calendar-cell unwritten") : "calendar-cell empty"}">
                  ${
                    cell
                      ? `
                    <div class="day-content">
                      <div class="day-header">
                        <span class="day-number">${cell.day}</span>
                        <span class="day-status">${cell.isWritten ? "✨" : ""}</span>
                      </div>
                      ${
                        cell.isWritten
                          ? `
                        <a href="${cell.link}" class="main-link" target="_parent" rel="noopener">
                          <div class="day-info" data-status="written">
                            <h3 class="day-title">${cell.title}</h3>
                            <p class="day-description">${cell.description}</p>
                          </div>
                        </a>
                      `
                          : `
                        <div class="day-info" data-status="unwritten">
                          <h3 class="day-title">${cell.title}</h3>
                          <p class="day-description">${cell.description}</p>
                        </div>
                      `
                      }
                    </div>
                  `
                      : '<div class="empty-cell"></div>'
                  }
                </td>
              `,
                )
                .join("")}
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }
}

// Register the custom element
customElements.define("advent-calendar-2025", AdventCalendar2025);
