import { IProduct } from "../ts_types/types";
import * as yup from "yup";

export const productSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().positive().integer().required(),
});

export const stockSchema = yup.object({
  count: yup.number().integer().min(0).required(),
});

export const products: IProduct[] = [
  {
    id: "1",
    title: "AWS Lambda",
    description: "Run code without thinking about servers or clusters",
    price: 12,
    count: 4,
  },
  {
    id: "2",
    title: "Amazon EC2",
    description: "Secure and resizable compute capacity for virtually any workload",
    price: 13,
    count: 5,
  },
  {
    id: "3",
    title: "Amazon S3",
    description: "Object storage built to retrieve any amount of data from anywhere",
    price: 35,
    count: 0,
  },
  {
    id: "4",
    title: "Amazon Simple Queue Service",
    description: "Fully managed message queuing for microservices, distributed systems, and serverless applications",
    price: 45,
    count: 1,
  },
  {
    id: "5",
    title: "AWS Amplify",
    description: "Build full-stack web and mobile apps in hours. Easy to start, easy to scale",
    price: 6,
    count: 11,
  },
  {
    id: "6",
    title: "AWS IoT Analytics",
    description: "Fully managed, operationalized analytics for your IoT devices",
    price: 12,
    count: 24,
  },
  {
    id: "7",
    title: "Amazon API Gateway",
    description: "Create, maintain, and secure APIs at any scale",
    price: 8,
    count: 8,
  },
  {
    id: "8",
    title: "Blockchain on AWS",
    description: "Enterprise blockchain made real",
    price: 11,
    count: 7,
  },
  {
    id: "9",
    title: "Amazon EC2 Auto Scaling",
    description: "Add or remove compute capacity to meet changing demand",
    price: 45,
    count: 6,
  },
  {
    id: "10",
    title: "AWS Elastic Beanstalk",
    description: "Deploy and scale web applications",
    price: 12,
    count: 2,
  },
  {
    id: "11",
    title: "AWS Local Zones",
    description: "Run latency sensitive applications closer to end users",
    price: 32,
    count: 3,
  },
  {
    id: "12",
    title: "Amazon Simple Notification Service",
    description: "Fully managed Pub/Sub service for A2A and A2P messaging",
    price: 18,
    count: 19,
  },
  {
    id: "13",
    title: "Amazon DynamoDB",
    description: "Serverless, NoSQL database with single-digit millisecond performance at any scale",
    price: 12,
    count: 17,
  },
];