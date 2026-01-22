class AdventCalendar2025 extends HTMLElement {
  constructor() {
    super();
    this.adventData = [];
  }

  async connectedCallback() {
    try {
      // Fetch actual blog posts from blog.sakupi01.com
      const response = await fetch("https://blog.sakupi01.com/blog.json");
      if (!response.ok) {
        throw new Error(`fetch error. status: ${response.status}`);
      }
      const posts = await response.json();

      // Process the data
      this.adventData = this.processAdventData(posts);

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
        const aNum = aMatch ? Number.parseInt(aMatch[1], 10) : 0;
        const bNum = bMatch ? Number.parseInt(bMatch[1]) : 0;
        return aNum - bNum;
      });

    for (const post of cssAdventPosts) {
      const match = post.link.match(/2025-css-advent-(\d+)/);
      if (match) {
        const dayNumber = Number.parseInt(match[1], 10);
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
        /* =============================================
           Component: AdventCalendar2025
           Namespace: ac2025
           ============================================= */

        /* Base component */
        .ac2025 {
          /* Component-specific CSS variables for theming */
          /* Dynamic spacing based on container width */
          --ac2025-spacing-xs: clamp(0.25rem, 0.5cqw, 0.4rem);
          --ac2025-spacing-sm: clamp(0.375rem, 0.75cqw, 0.5rem);
          --ac2025-spacing-md: clamp(0.5rem, 1cqw, 0.75rem);
          --ac2025-spacing-lg: clamp(0.75rem, 1.5cqw, 1rem);
          
          /* Dynamic cell height based on container width */
          --ac2025-cell-height: clamp(60px, 12cqw, 140px);
          --ac2025-header-height: clamp(2.5rem, 4cqw, 3.5rem);
          
          /* Dynamic font sizes using container query units */
          --ac2025-font-size-xs: clamp(0.65rem, 1.2cqw, 0.85rem);
          --ac2025-font-size-sm: clamp(0.7rem, 1.5cqw, 0.9rem);
          --ac2025-font-size-md: clamp(0.8rem, 1.8cqw, 1.1rem);
          --ac2025-font-size-lg: clamp(0.9rem, 2.5cqw, 1.75rem);
          
          /* Static values for animations and styling */
          --ac2025-transition-duration: 0.2s;
          --ac2025-transition-easing: ease;
          
          --ac2025-border-radius-sm: max(2px, 0.2cqw);
          --ac2025-border-radius-md: max(4px, 0.4cqw);
          
          --ac2025-shadow-hover: 0 2px 4px rgba(0, 0, 0, 0.1);
          --ac2025-border-hover: max(2px, 0.2cqw);

          display: block;
          width: 100%;
          container-type: inline-size;
          container-name: calendar;
          box-sizing: border-box;
        }

        /* Ensure all children use border-box */
        .ac2025 *,
        .ac2025 *::before,
        .ac2025 *::after {
          box-sizing: border-box;
        }

        /* =============================================
           Structure: Calendar Table Layout
           ============================================= */
        
        .ac2025__table {
          table-layout: fixed;
          width: 100%;
          border-collapse: separate;
          border-spacing: 2px;
          background: var(--link-border);
          border-radius: var(--ac2025-border-radius-md);
          overflow: hidden;
          margin: 0;
        }

        .ac2025__weekday-header {
          background: var(--card-bg-hover);
          padding: var(--ac2025-spacing-md) var(--ac2025-spacing-sm);
          text-align: center;
          font-weight: 600;
          color: var(--color-text);
          font-size: var(--ac2025-font-size-sm);
          border: none;
          height: var(--ac2025-header-height);
        }

        /* =============================================
           Structure: Calendar Cell Base
           ============================================= */
        
        .ac2025__cell {
          width: 14.28%; /* 100% / 7 days */
          padding: 0;
          border: none;
          position: relative;
          vertical-align: top;
          height: var(--ac2025-cell-height);
          overflow: hidden; /* Prevent content overflow */
          /* Contain any overflowing content */
          contain: layout style paint;
          /* Each cell can also be a container for even more granular control */
          container-type: inline-size;
          container-name: cell;
        }

        /* Cell States (using modifiers) */
        .ac2025__cell--empty {
          background: light-dark(
            color-mix(in oklch, var(--card-bg), transparent 50%),
            color-mix(in oklch, var(--card-bg), transparent 50%)
          );
          opacity: 0.3;
        }

        .ac2025__cell--active {
          background: var(--card-bg);
        }

        .ac2025__cell--written {
          background: light-dark(
            color-mix(in oklch, var(--color-primary-medium), white 95%),
            color-mix(in oklch, var(--color-primary-medium), black 90%)
          );
        }

        .ac2025__cell--unwritten {
          background: var(--card-bg);
          opacity: 0.6;
        }

        /* =============================================
           Structure: Day Content Container
           ============================================= */
        
        .ac2025__day-content {
          display: grid;
          grid-template-rows: auto 1fr;
          height: 100%;
          /* Contain any overflowing content */
          contain: layout style;
        }

        /* Apply padding only to unwritten cells */
        .ac2025__cell--unwritten .ac2025__day-content {
          padding: var(--ac2025-spacing-sm);
        }

        /* =============================================
           Structure: Link Container (using subgrid)
           ============================================= */
        
        .ac2025__link {
          display: grid;
          grid-template-rows: subgrid;
          grid-row: 1 / -1;
          text-decoration: none;
          border: none;
          color: inherit;
          padding: var(--ac2025-spacing-sm);
          transition: all var(--ac2025-transition-duration) var(--ac2025-transition-easing);
          /* Ensure link fills cell properly */
          width: 100%;
          height: 100%;
        }

        /* Link hover state */
        .ac2025__cell--written .ac2025__link:hover, .ac2025__link:focus {
          background: light-dark(
            color-mix(in oklch, var(--color-primary-medium), white 90%),
            color-mix(in oklch, var(--color-primary-medium), black 85%)
          );
          box-shadow: inset 0 0 0 var(--ac2025-border-hover) var(--color-primary-medium), 
                      var(--ac2025-shadow-hover);
          border-radius: var(--ac2025-border-radius-sm);
        }

        /* =============================================
           Components: Day Header
           ============================================= */
        
        .ac2025__day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--ac2025-spacing-sm);
        }

        .ac2025__day-number {
          color: var(--color-primary-medium);
          font-size: var(--ac2025-font-size-lg);
          margin: 0;
          line-height: 1;
        }

        .ac2025__day-status {
          font-size: var(--ac2025-font-size-md);
          font-weight: 700;
        }

        .ac2025__day-status--written {
          color: var(--color-primary-medium);
        }

        .ac2025__day-status--unwritten {
          color: var(--color-text);
          opacity: 0.4;
        }

        /* =============================================
           Components: Day Info
           ============================================= */
        
        .ac2025__day-info {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .ac2025__day-title {
          font-size: var(--ac2025-font-size-md);
          color: var(--color-text);
          margin-bottom: var(--ac2025-spacing-xs);
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
          font-weight: 600;
        }

        .ac2025__day-description {
          font-size: var(--ac2025-font-size-xs);
          color: var(--color-text);
          opacity: 0.7;
          line-height: 1.3;
          margin: 0;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* =============================================
           Utilities: Empty Cell
           ============================================= */
        
        .ac2025__empty-cell {
          height: 100%;
        }

        /* =============================================
           Container Queries for Responsive Design
           ============================================= */
        
        /* Extra small container: < 400px */
        @container calendar (max-width: 400px) {
          .ac2025__table {
            border-spacing: 1px;
          }

          .ac2025__cell {
            height: 50px;
          }

          .ac2025__weekday-header {
            font-size: 0.6rem;
            padding: 0.3rem 0.1rem;
            height: 2rem;
          }

          .ac2025__day-number {
            font-size: 0.75rem;
          }

          /* Only show day number at very small sizes */
          .ac2025__day-status {
            display: none;
          }
        }

        /* Small container: 400px - 600px */
        @container calendar (min-width: 400px) and (max-width: 600px) {
          .ac2025__cell {
            height: 70px;
          }

          /* Hide text content but show emoji */
          .ac2025__day-description,
          .ac2025__day-title {
            display: none;
          }

          /* Show emoji indicator for written days inline */
          .ac2025__day-info--written::after {
            content: "🎨";
            display: inline-block;
            margin-left: 0.5rem;
            font-size: clamp(0.8rem, 3cqw, 1.2rem);
            text-align: center;
          }
        }

        /* Medium container: 600px - 900px */
        @container calendar (min-width: 600px) and (max-width: 900px) {
          .ac2025__day-title {
            -webkit-line-clamp: 3;
            font-size: clamp(0.85rem, 1.5cqw, 0.95rem);
          }

          .ac2025__day-description {
            font-size: clamp(0.65rem, 1.2cqw, 0.75rem);
            -webkit-line-clamp: 4;
          }
        }

        /* Large container: > 900px */
        @container calendar (min-width: 900px) {
          /* Content is fully visible with default styles */
        }

        /* Extra large container: > 1400px */
        @container calendar (min-width: 1400px) {
          .ac2025__table {
            border-spacing: 3px;
          }

          .ac2025__day-header {
            margin-bottom: 0.75rem;
          }

          .ac2025__day-title {
            -webkit-line-clamp: 3;
            margin-bottom: 0.5rem;
          }

          .ac2025__day-description {
            -webkit-line-clamp: 3;
          }
        }

        /* =============================================
           Aspect-ratio based Container Queries
           ============================================= */
        
        /* Portrait orientation (taller than wide) */
        @container calendar (aspect-ratio < 1/1) {
          .ac2025__cell {
            height: clamp(40px, 8cqw, 80px);
          }
          
          .ac2025__table {
            border-spacing: 1px;
          }
        }

        /* Square-ish containers */
        @container calendar (1/1 <= aspect-ratio <= 3/2) {
          .ac2025__cell {
            height: clamp(70px, 12cqw, 110px);
          }
        }

        /* Wide containers */
        @container calendar (aspect-ratio > 2/1) {
          .ac2025__cell {
            height: clamp(90px, 8cqw, 140px);
          }
          
          .ac2025__day-title {
            -webkit-line-clamp: 3;
          }
        }

        /* =============================================
           Cell-level Container Queries
           ============================================= */
        
        /* Adjust content within individual cells based on cell size */
        @container cell (max-width: 80px) {
          .ac2025__day-number {
            font-size: 0.875rem !important;
          }
          
          .ac2025__day-status {
            font-size: 0.75rem !important;
          }
        }

        @container cell (min-width: 120px) {
          .ac2025__day-info {
            gap: 0.25rem;
          }
        }

        /* =============================================
           Accessibility & Progressive Enhancement
           ============================================= */
        
        @media (prefers-reduced-motion: reduce) {
          .ac2025__link {
            transition: none;
          }
        }

        @media (prefers-contrast: high) {
          .ac2025__table {
            border: 2px solid;
          }

          .ac2025__cell--written {
            background: highlight;
            color: highlighttext;
          }
        }

        /* =============================================
           Fallback for browsers without container query support
           ============================================= */
        
           /* Fallback to viewport-based media queries */
           @media (max-width: 650px) {
             .ac2025__cell {
               height: 80px;
             }
 
             .ac2025__weekday-header {
               padding: 0.4rem 0.2rem;
               font-size: 0.7rem;
             }
 
             .ac2025__day-description,
             .ac2025__day-status,
             .ac2025__day-title {
               display: none;
             }
 
             .ac2025__day-info--written::after {
               content: "🎨";
               display: inline-block;
               margin-left: 0.5rem;
               font-size: 1rem;
              text-align: center;
             }
           }


        /* =============================================
           Print Styles with Container Awareness
           ============================================= */
        
        @media print {
          .ac2025 {
            container-type: normal; /* Disable container queries for print */
          }
          
          .ac2025__table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          .ac2025__cell {
            border: 1px solid #000;
            height: auto;
            min-height: 80px;
          }

          .ac2025__link:hover {
            box-shadow: none;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Render the calendar content
    this.innerHTML = `
      <div class="ac2025">
        <table class="ac2025__table">
          <!-- Weekday headers -->
          <thead>
            <tr>
              ${weekdays.map((day) => `<th class="ac2025__weekday-header">${day}</th>`).join("")}
            </tr>
          </thead>
          
          <!-- Calendar body -->
          <tbody>
            ${calendarGrid
              .map(
                (week) => `
              <tr class="ac2025__week">
                ${week
                  .map((cell) => {
                    if (!cell) {
                      return `<td class="ac2025__cell ac2025__cell--empty">
                          <div class="ac2025__empty-cell"></div>
                        </td>`;
                    }

                    const cellClass = cell.isWritten
                      ? "ac2025__cell ac2025__cell--active ac2025__cell--written"
                      : "ac2025__cell ac2025__cell--active ac2025__cell--unwritten";

                    const statusClass = cell.isWritten
                      ? "ac2025__day-status ac2025__day-status--written"
                      : "ac2025__day-status ac2025__day-status--unwritten";

                    const infoClass = cell.isWritten
                      ? "ac2025__day-info ac2025__day-info--written"
                      : "ac2025__day-info ac2025__day-info--unwritten";

                    if (cell.isWritten) {
                      return `
                          <td class="${cellClass}">
                            <div class="ac2025__day-content">
                              <a href="${cell.link}" class="ac2025__link" target="_parent" rel="noopener">
                                <div class="ac2025__day-header">
                                  <h4 class="ac2025__day-number">${cell.day}</h4>
                                  <span class="${statusClass}">✨</span>
                                </div>
                                <div class="${infoClass}" data-status="written">
                                  <h5 class="ac2025__day-title">${cell.title}</h5>
                                  <p class="ac2025__day-description">${cell.description}</p>
                                </div>
                              </a>
                            </div>
                          </td>
                        `;
                    }
                    return `
                          <td class="${cellClass}">
                            <div class="ac2025__day-content">
                              <div class="ac2025__day-header">
                                <h4 class="ac2025__day-number">${cell.day}</h4>
                                <span class="${statusClass}"></span>
                              </div>
                              <div class="${infoClass}" data-status="unwritten">
                                <p class="ac2025__day-description">${cell.description}</p>
                              </div>
                            </div>
                          </td>
                        `;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }
}

// Register the custom element
customElements.define("advent-calendar-2025", AdventCalendar2025);
