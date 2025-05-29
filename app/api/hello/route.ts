/**
 * Example API route handler for Next.js
 * This file demonstrates a simple GET endpoint that returns a JSON response
 */

export async function GET(request: Request) {
  // You can access query parameters, headers, and other request properties from the request object
  // For example: const { searchParams } = new URL(request.url)

  // Return a JSON response
  return Response.json({
    message: 'Hello from the API!',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
}

