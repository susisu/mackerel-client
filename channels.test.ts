import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { ChannelsApiClient } from "./channels.ts";

describe("ChannelsApiClient", () => {
  describe("#list", () => {
    it("list Channels via GET /api/v0/channels", async () => {
      const handler = spy((_?: FetchOptions) => ({
        channels: [
          {
            id: "channel-0",
            name: "my channel 1",
            suspendedAt: null,
            type: "amazon-event-bridge",
          },
          {
            id: "channel-1",
            name: "my channel 2",
            suspendedAt: 1717677296,
            type: "webhook",
            url: "https://example.com/",
            enabledGraphImage: true,
            events: ["alert"],
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/channels", handler);
      const cli = new ChannelsApiClient(fetcher);

      const channels = await cli.list();

      assertSpyCalls(handler, 1);

      assertEquals(channels, [
        {
          id: "channel-0",
          name: "my channel 1",
          suspendedAt: undefined,
          type: "amazon-event-bridge",
        },
        {
          id: "channel-1",
          name: "my channel 2",
          suspendedAt: new Date("2024-06-06T12:34:56Z"),
          type: "webhook",
          url: "https://example.com/",
          includeGraphImages: true,
          events: ["alert"],
        },
      ]);
    });
  });

  describe("#create", () => {
    it("creates a Channel via POST /api/v0/channels", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "channel-0",
        name: "my channel",
        suspendedAt: null,
        type: "webhook",
        url: "https://example.com/",
        enabledGraphImage: true,
        events: ["alert"],
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/channels", handler);
      const cli = new ChannelsApiClient(fetcher);

      const channel = await cli.create({
        name: "my channel",
        type: "webhook",
        url: "https://example.com/",
        includeGraphImages: true,
        events: ["alert"],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my channel",
        type: "webhook",
        url: "https://example.com/",
        enabledGraphImage: true,
        events: ["alert"],
      });

      assertEquals(channel, {
        id: "channel-0",
        name: "my channel",
        suspendedAt: undefined,
        type: "webhook",
        url: "https://example.com/",
        includeGraphImages: true,
        events: ["alert"],
      });
    });
  });

  describe("#delete", () => {
    it("deletes a Channel via DELETE /api/v0/channels/:channelId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "channel-0",
        name: "my channel",
        suspendedAt: null,
        type: "webhook",
        url: "https://example.com/",
        enabledGraphImage: true,
        events: ["alert"],
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/channels/channel-0", handler);
      const cli = new ChannelsApiClient(fetcher);

      const channel = await cli.delete("channel-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(channel, {
        id: "channel-0",
        name: "my channel",
        suspendedAt: undefined,
        type: "webhook",
        url: "https://example.com/",
        includeGraphImages: true,
        events: ["alert"],
      });
    });
  });

  describe("listNotificationGroups", () => {
    it("lists NotificationGroups via GET /api/v0/notification-groups", async () => {
      const handler = spy((_?: FetchOptions) => ({
        notificationGroups: [
          {
            id: "group-0",
            name: "my group 1",
            notificationLevel: "all",
            childNotificationGroupIds: ["group-1"],
            childChannelIds: ["channel-0", "channel-1"],
            services: [
              { name: "foo" },
              { name: "bar" },
            ],
            monitors: [
              { id: "monitor-0", skipDefault: true },
              { id: "monitor-1", skipDefault: false },
            ],
          },
          {
            id: "group-1",
            name: "my group 2",
            notificationLevel: "critical",
            childNotificationGroupIds: [],
            childChannelIds: ["channel-2", "channel-3"],
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/notification-groups", handler);
      const cli = new ChannelsApiClient(fetcher);

      const groups = await cli.listNotificationGroups();

      assertSpyCalls(handler, 1);

      assertEquals(groups, [
        {
          id: "group-0",
          name: "my group 1",
          notificationLevel: "all",
          childNotificationGroupIds: ["group-1"],
          childChannelIds: ["channel-0", "channel-1"],
          scopes: {
            services: [
              { name: "foo" },
              { name: "bar" },
            ],
            monitors: [
              { id: "monitor-0", maskDefaultNotificationGroup: true },
              { id: "monitor-1", maskDefaultNotificationGroup: false },
            ],
          },
        },
        {
          id: "group-1",
          name: "my group 2",
          notificationLevel: "critical",
          childNotificationGroupIds: [],
          childChannelIds: ["channel-2", "channel-3"],
          scopes: {
            services: [],
            monitors: [],
          },
        },
      ]);
    });
  });

  describe("createNotificationGroups", () => {
    it("creates a NotificationGroup via POST /api/v0/notification-groups", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "group-0",
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        services: [
          { name: "foo" },
          { name: "bar" },
        ],
        monitors: [
          { id: "monitor-0", skipDefault: true },
          { id: "monitor-1", skipDefault: false },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/notification-groups", handler);
      const cli = new ChannelsApiClient(fetcher);

      const group = await cli.createNotificationGroups({
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        scopes: {
          services: [
            { name: "foo" },
            { name: "bar" },
          ],
          monitors: [
            { id: "monitor-0", maskDefaultNotificationGroup: true },
            { id: "monitor-1", maskDefaultNotificationGroup: false },
          ],
        },
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        services: [
          { name: "foo" },
          { name: "bar" },
        ],
        monitors: [
          { id: "monitor-0", skipDefault: true },
          { id: "monitor-1", skipDefault: false },
        ],
      });

      assertEquals(group, {
        id: "group-0",
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        scopes: {
          services: [
            { name: "foo" },
            { name: "bar" },
          ],
          monitors: [
            { id: "monitor-0", maskDefaultNotificationGroup: true },
            { id: "monitor-1", maskDefaultNotificationGroup: false },
          ],
        },
      });
    });
  });

  describe("updateNotificationGroups", () => {
    it("updates a NotificationGroup via PUT /api/v0/notification-groups/:groupId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "group-0",
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        services: [
          { name: "foo" },
          { name: "bar" },
        ],
        monitors: [
          { id: "monitor-0", skipDefault: true },
          { id: "monitor-1", skipDefault: false },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/notification-groups/group-0", handler);
      const cli = new ChannelsApiClient(fetcher);

      const group = await cli.updateNotificationGroups("group-0", {
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        scopes: {
          services: [
            { name: "foo" },
            { name: "bar" },
          ],
          monitors: [
            { id: "monitor-0", maskDefaultNotificationGroup: true },
            { id: "monitor-1", maskDefaultNotificationGroup: false },
          ],
        },
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        services: [
          { name: "foo" },
          { name: "bar" },
        ],
        monitors: [
          { id: "monitor-0", skipDefault: true },
          { id: "monitor-1", skipDefault: false },
        ],
      });

      assertEquals(group, {
        id: "group-0",
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        scopes: {
          services: [
            { name: "foo" },
            { name: "bar" },
          ],
          monitors: [
            { id: "monitor-0", maskDefaultNotificationGroup: true },
            { id: "monitor-1", maskDefaultNotificationGroup: false },
          ],
        },
      });
    });
  });

  describe("deleteNotificationGroups", () => {
    it("deletes a NotificationGroup via DELETE /api/v0/notification-groups/:groupId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "group-0",
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        services: [
          { name: "foo" },
          { name: "bar" },
        ],
        monitors: [
          { id: "monitor-0", skipDefault: true },
          { id: "monitor-1", skipDefault: false },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/notification-groups/group-0", handler);
      const cli = new ChannelsApiClient(fetcher);

      const group = await cli.deleteNotificationGroups("group-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(group, {
        id: "group-0",
        name: "my group",
        notificationLevel: "all",
        childNotificationGroupIds: ["group-1"],
        childChannelIds: ["channel-0", "channel-1"],
        scopes: {
          services: [
            { name: "foo" },
            { name: "bar" },
          ],
          monitors: [
            { id: "monitor-0", maskDefaultNotificationGroup: true },
            { id: "monitor-1", maskDefaultNotificationGroup: false },
          ],
        },
      });
    });
  });
});
