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
    id: "1e6db14c-4c3b-4840-b39b-e154745e5149",
    title: "AWS Lambda",
    description: "Run code without thinking about servers or clusters",
    price: 12,
    count: 4,
  },
  {
    id: "5df54c89-3787-4a60-801d-ab3e31156866",
    title: "Amazon EC2",
    description: "Secure and resizable compute capacity for virtually any workload",
    price: 13,
    count: 5,
  },
  {
    id: "e3a68be8-3d7c-4022-9acf-d31a124bc800",
    title: "Amazon S3",
    description: "Object storage built to retrieve any amount of data from anywhere",
    price: 35,
    count: 0,
  },
  {
    id: "21da1dec-ca6f-4ae4-af6b-e6f88942c5eb",
    title: "Amazon Simple Queue Service",
    description: "Fully managed message queuing for microservices, distributed systems, and serverless applications",
    price: 45,
    count: 1,
  },
  {
    id: "21da1dec-ca6f-4ae4-af6b-e6f88942c5eb",
    title: "AWS Amplify",
    description: "Build full-stack web and mobile apps in hours. Easy to start, easy to scale",
    price: 6,
    count: 11,
  },
  {
    id: "d4a72b24-e270-40f3-953c-8d3688ffefd7",
    title: "AWS IoT Analytics",
    description: "Fully managed, operationalized analytics for your IoT devices",
    price: 12,
    count: 24,
  },
  {
    id: "a691e28e-e2b2-4938-90a6-5a02c1dbca56",
    title: "Amazon API Gateway",
    description: "Create, maintain, and secure APIs at any scale",
    price: 8,
    count: 8,
  },
  {
    id: "11d12ba9-2a17-4b7b-995f-6a3eb91d7588",
    title: "Blockchain on AWS",
    description: "Enterprise blockchain made real",
    price: 11,
    count: 7,
  },
  {
    id: "2aa3c6e2-72e6-4862-8d0e-17cbde0d7ab4",
    title: "Amazon EC2 Auto Scaling",
    description: "Add or remove compute capacity to meet changing demand",
    price: 45,
    count: 6,
  },
  {
    id: "50300401-223c-4ea2-9416-a7d8d3231654",
    title: "AWS Elastic Beanstalk",
    description: "Deploy and scale web applications",
    price: 12,
    count: 2,
  },
  {
    id: "a93331cf-51d5-4493-830c-e66c9d46c2de",
    title: "AWS Local Zones",
    description: "Run latency sensitive applications closer to end users",
    price: 32,
    count: 3,
  },
  {
    id: "35c025fb-13be-44e5-b406-76a89906e9df",
    title: "Amazon Simple Notification Service",
    description: "Fully managed Pub/Sub service for A2A and A2P messaging",
    price: 18,
    count: 19,
  },
  {
    id: "2f79450f-24a8-4217-ba08-185e32e18cf4",
    title: "Amazon DynamoDB",
    description: "Serverless, NoSQL database with single-digit millisecond performance at any scale",
    price: 12,
    count: 17,
  },
];