# Task Breakdown: Responsive Image Component

## Overview

Total Tasks: 15

This feature consolidates image rendering logic currently duplicated across `ImageBlockView` and `TeaserBlockView`/templates into a single reusable `ResponsiveImage` component. The component handles Plone's `image_scales` data format with srcset generation.

## Task List

### Foundation Layer

#### Task Group 1: Component Setup and Core Implementation

**Dependencies:** None

- [x] 1.0 Complete ResponsiveImage component foundation
  - [x] 1.1 Write 3-5 focused tests for ResponsiveImage component
    - Test srcset generation from scales object
    - Test that picture/source/img elements render correctly
    - Test that alt prop is applied to img element
    - Test that missing or empty scales are handled gracefully
  - [x] 1.2 Create `src/lib/components/` directory structure
    - Create the new shared components directory
    - This will house reusable UI components separate from block-specific components
  - [x] 1.3 Create ResponsiveImage.svelte with Props interface
    - Location: `src/lib/components/ResponsiveImage.svelte`
    - Use Svelte 5 `$props()` pattern with TypeScript
    - Define Props interface with JSDoc comments:
      - `scales`: object (required) - Plone image_scales data
      - `baseUrl`: string (required) - Base URL for image paths
      - `alt`: string (required) - Alt text for accessibility
      - `sizes`: string (optional, default: `100vw`) - Responsive sizing hints
      - `width`: number (optional) - Image width for CLS prevention
      - `height`: number (optional) - Image height for CLS prevention
      - `loading`: `'lazy' | 'eager'` (optional, default: `lazy`) - Loading strategy
      - `class`: string (optional) - Custom CSS class for img element
  - [x] 1.4 Implement srcset generation logic
    - Extract pattern from `TeaserBlockView.svelte` (lines 100-113)
    - Use `$derived()` for computed srcset value
    - Iterate over scales object entries
    - Format each entry as `{baseUrl}/{download} {width}w`
    - Join entries with comma separator
    - Return empty string if scales is empty/undefined
  - [x] 1.5 Implement picture element markup
    - Use semantic `picture` element structure
    - Add `source` element with srcset and sizes attributes
    - Add `img` element as fallback with direct src
    - Apply width/height attributes on `img` for layout stability
    - Apply loading attribute (default: `lazy`)
    - Apply class prop to `img` element
    - Always include alt attribute on `img`
  - [x] 1.6 Ensure ResponsiveImage component tests pass
    - Run ONLY the 3-5 tests written in 1.1
    - Verify srcset generation works correctly
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 3-5 tests written in 1.1 pass
- `src/lib/components/ResponsiveImage.svelte` exists with complete Props interface
- Srcset generation correctly formats Plone image_scales data
- Picture/source/img structure renders with proper attributes
- Alt prop is required and applied correctly
- Empty/missing scales handled gracefully (no errors)

### Integration Layer

#### Task Group 2: ImageBlockView Integration

**Dependencies:** Task Group 1

- [x] 2.0 Complete ImageBlockView integration
  - [x] 2.1 Write 2-3 focused tests for ImageBlockView using ResponsiveImage
    - Test that ImageBlockView renders ResponsiveImage component
    - Test that correct props are passed from block data
    - Test that wrapper element preserves existing CSS classes
  - [x] 2.2 Refactor ImageBlockView to use ResponsiveImage
    - Import ResponsiveImage from `$lib/components/ResponsiveImage.svelte`
    - Replace inline picture/source/img markup
    - Pass `data.image_scales.image[0].scales` as scales prop
    - Construct baseUrl from `data.url`
    - Pass `data.alt` as alt prop
    - Keep original dimensions from image data
  - [x] 2.3 Preserve wrapper element styling
    - Keep `<p class="block image">` wrapper element
    - Ensure existing CSS classes remain intact
    - Maintain any existing CSS that targets the wrapper
  - [x] 2.4 Remove duplicate srcset building code
    - Delete the inline `for` loop that builds srcset (lines 4-10)
    - Delete the `image_scales` array variable
    - Delete the `srcset` constant
    - Let ResponsiveImage handle all srcset logic internally
  - [x] 2.5 Ensure ImageBlockView integration tests pass
    - Run ONLY the 2-3 tests written in 2.1
    - Verify ImageBlockView renders correctly with ResponsiveImage
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 2-3 tests written in 2.1 pass
- ImageBlockView uses ResponsiveImage component
- No duplicate srcset logic in ImageBlockView
- Existing wrapper styling preserved
- Image renders with correct responsive behavior

#### Task Group 3: Teaser Templates Integration

**Dependencies:** Task Group 1

- [x] 3.0 Complete Teaser templates integration
  - [x] 3.1 Write 3-4 focused tests for Teaser templates using ResponsiveImage
    - Test DefaultTeaserTemplate renders ResponsiveImage when hasImage is true
    - Test EventTeaserTemplate renders ResponsiveImage when hasImage is true
    - Test that image-wrapper div is preserved for layout styling
    - Test that correct props are passed through from TeaserBlockView
  - [x] 3.2 Refactor DefaultTeaserTemplate to use ResponsiveImage
    - Import ResponsiveImage from `$lib/components/ResponsiveImage.svelte`
    - Replace inline picture/source/img markup (lines 41-51)
    - Keep `.image-wrapper` div for layout styling
    - Pass srcset, imageSrc, imageAlt, imageWidth, imageHeight as props
    - Note: TeaserBlockView pre-computes these values, so templates receive ready-to-use props
    - Add new prop for scales to support direct ResponsiveImage usage
  - [x] 3.3 Update DefaultTeaserTemplate Props interface
    - Add optional `scales` prop for ResponsiveImage integration
    - Add optional `imageBaseUrl` prop for ResponsiveImage integration
    - Keep existing props for backward compatibility during transition
    - Update JSDoc comments
  - [x] 3.4 Refactor EventTeaserTemplate to use ResponsiveImage
    - Import ResponsiveImage from `$lib/components/ResponsiveImage.svelte`
    - Replace inline picture/source/img markup (lines 103-113)
    - Keep `.image-wrapper` div for layout styling
    - Apply same prop changes as DefaultTeaserTemplate
  - [x] 3.5 Update EventTeaserTemplate Props interface
    - Mirror changes from DefaultTeaserTemplate
    - Add optional `scales` and `imageBaseUrl` props
    - Keep existing props for backward compatibility
    - Update JSDoc comments
  - [x] 3.6 Add ResponsiveImage-specific class handling
    - Pass `class="teaser-image"` to ResponsiveImage component
    - Ensure CSS targeting `.teaser-image` continues to work
    - Verify aspect-ratio and object-fit styles apply correctly
  - [x] 3.7 Ensure Teaser templates integration tests pass
    - Run ONLY the 3-4 tests written in 3.1
    - Verify both templates render correctly with ResponsiveImage
    - Do NOT run the entire test suite at this stage

**Acceptance Criteria:**

- The 3-4 tests written in 3.1 pass
- DefaultTeaserTemplate uses ResponsiveImage component
- EventTeaserTemplate uses ResponsiveImage component
- `.image-wrapper` div preserved in both templates
- `.teaser-image` class applied via ResponsiveImage
- Existing teaser styling continues to work
- Props interface updated with clear documentation

### Testing

#### Task Group 4: Test Review and Gap Analysis

**Dependencies:** Task Groups 1-3

- [x] 4.0 Review existing tests and fill critical gaps only
  - [x] 4.1 Review tests from Task Groups 1-3
    - Review the 3-5 tests written for ResponsiveImage (Task 1.1)
    - Review the 2-3 tests written for ImageBlockView (Task 2.1)
    - Review the 3-4 tests written for Teaser templates (Task 3.1)
    - Total existing tests: approximately 8-12 tests
  - [x] 4.2 Analyze test coverage gaps for this feature only
    - Identify critical integration workflows that lack test coverage
    - Focus ONLY on gaps related to ResponsiveImage component usage
    - Do NOT assess entire application test coverage
    - Prioritize end-to-end rendering verification over unit test gaps
  - [x] 4.3 Write up to 5 additional strategic tests maximum
    - Add maximum of 5 new tests to fill identified critical gaps
    - Potential gap areas:
      - Test ResponsiveImage with various sizes prop values
      - Test ResponsiveImage with loading="eager" override
      - Test integration when scales object has single scale entry
      - Test that empty alt string is allowed (decorative images)
    - Skip edge cases, performance tests unless business-critical
  - [x] 4.4 Run feature-specific tests only
    - Run ONLY tests related to ResponsiveImage feature
    - Expected total: approximately 13-17 tests maximum
    - Verify critical workflows pass
    - Do NOT run the entire application test suite

**Acceptance Criteria:**

- All feature-specific tests pass (approximately 13-17 tests total)
- Critical user workflows for ResponsiveImage are covered
- No more than 5 additional tests added when filling in gaps
- Testing focused exclusively on this spec's feature requirements

## Execution Order

Recommended implementation sequence:

1. **Task Group 1: Component Setup and Core Implementation** - Create the ResponsiveImage component with full functionality
2. **Task Group 2: ImageBlockView Integration** - Refactor simplest consumer first
3. **Task Group 3: Teaser Templates Integration** - Refactor more complex consumers with existing prop preprocessing
4. **Task Group 4: Test Review and Gap Analysis** - Verify complete integration

## Key Files Reference

| File                                                           | Purpose                                             |
| -------------------------------------------------------------- | --------------------------------------------------- |
| `src/lib/components/ResponsiveImage.svelte`                    | NEW - Reusable responsive image component           |
| `src/lib/blocks/image/ImageBlockView.svelte`                   | MODIFY - Use ResponsiveImage, remove srcset logic   |
| `src/lib/blocks/teaser/templates/DefaultTeaserTemplate.svelte` | MODIFY - Use ResponsiveImage                        |
| `src/lib/blocks/teaser/templates/EventTeaserTemplate.svelte`   | MODIFY - Use ResponsiveImage                        |
| `src/lib/blocks/teaser/TeaserBlockView.svelte`                 | REFERENCE ONLY - Contains srcset pattern to extract |

## Technical Notes

- Use Svelte 5 `$props()` and `$derived()` patterns consistently
- Follow existing Props interface pattern with JSDoc comments from teaser templates
- Srcset generation logic mirrors `TeaserBlockView.svelte` lines 100-113
- Picture element structure mirrors `DefaultTeaserTemplate.svelte` lines 41-51
- Tests use Vitest as specified in tech stack
